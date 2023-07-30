import {
  Update,
  receiveUpdates,
  sendableUpdates,
  collab,
  getSyncedVersion,
} from '@codemirror/collab';
import { StateEffect, Text, ChangeSet } from '@codemirror/state';
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { Socket } from 'socket.io-client';

import { cursor, addCursor } from './cursors';

function pushUpdates(
  socket: Socket,
  nickname: string,
  version: number,
  fullUpdates: readonly Update[],
): Promise<boolean> {
  // Strip off transaction data
  const updates = fullUpdates.map((u) => ({
    clientID: u.clientID,
    changes: u.changes.toJSON(),
    effects: u.effects,
  }));

  return new Promise(function (resolve) {
    socket.emit('pushUpdates', { nickname, version, docUpdates: JSON.stringify(updates) });

    socket.once('pushUpdateResponse', function (status: boolean) {
      resolve(status);
    });
  });
}

function pullUpdates(
  socket: Socket,
  nickname: string,
  version: number,
): Promise<readonly Update[]> {
  return new Promise(function (resolve) {
    socket.emit('pullUpdates', { nickname, version });

    socket.once('pullUpdateResponse', function (updates: any) {
      resolve(JSON.parse(updates));
    });
  }).then((updates: any) =>
    updates.map((u: any) => {
      if (u.effects[0]) {
        const effects: StateEffect<any>[] = [];

        u.effects.forEach((effect: StateEffect<any>) => {
          if (effect.value?.id) {
            const cursor: cursor = {
              id: effect.value.id,
              from: effect.value.from,
              to: effect.value.to,
            };

            effects.push(addCursor.of(cursor));
          }
        });

        return {
          changes: ChangeSet.fromJSON(u.changes),
          clientID: u.clientID,
          effects,
        };
      }

      return {
        changes: ChangeSet.fromJSON(u.changes),
        clientID: u.clientID,
      };
    }),
  );
}

export function getDocument(
  socket: Socket,
  nickname: string,
): Promise<{ version: number; doc: Text }> {
  return new Promise(function (resolve) {
    socket.emit('getDocument', { nickname });

    socket.once('getDocumentResponse', function (version: number, doc: string) {
      resolve({
        version,
        doc: Text.of(doc.split('\n')),
      });
    });
  });
}

export const peerExtension = (socket: Socket, startVersion: number, nickname: string) => {
  const plugin = ViewPlugin.fromClass(
    class {
      private pushing = false;
      private done = false;

      constructor(private view: EditorView) {
        this.pull();
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.transactions[0]?.effects[0]) this.push();
      }

      async push() {
        const updates = sendableUpdates(this.view.state);
        if (this.pushing || !updates.length) return;
        this.pushing = true;
        const version = getSyncedVersion(this.view.state);
        await pushUpdates(socket, nickname, version, updates);
        this.pushing = false;
        // Regardless of whether the push failed or new updates came in
        // while it was running, try again if there's updates remaining
        if (sendableUpdates(this.view.state).length) setTimeout(() => this.push(), 100);
      }

      async pull() {
        while (!this.done) {
          const version = getSyncedVersion(this.view.state);
          const updates = await pullUpdates(socket, nickname, version);
          const newUpdates = receiveUpdates(this.view.state, updates);
          this.view.dispatch(newUpdates);
        }
      }

      destroy() {
        this.done = true;
      }
    },
  );

  return [
    collab({
      startVersion,
      clientID: nickname,
      sharedEffects: (tr) => {
        const effects = tr.effects.filter((e) => {
          return e.is(addCursor);
        });

        return effects;
      },
    }),
    plugin,
  ];
};
