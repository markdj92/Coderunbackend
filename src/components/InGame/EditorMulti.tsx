import { indentUnit } from '@codemirror/language';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import { getDocument, peerExtension } from '@/utils/collab';
import { cursorExtension } from '@/utils/cursors';

type Mode = 'light' | 'dark';

type EditorMultiProps = {
  socket: Socket;
  className?: string;
  title: string;
  nickname: string;
};

type EditorMultiState = {
  connected: boolean;
  version: number | null;
  title: string;
  nickname: string;
  doc: null | string;
  mode: Mode;
};

let editorKey = 0;

function EditorMulti(props: EditorMultiProps) {
  const [state, setState] = useState<EditorMultiState>({
    connected: false,
    version: null,
    doc: null,
    title: props.title,
    nickname: props.nickname,
    mode: 'dark',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { version, doc } = await getDocument(props.socket, state.title);

      setState((prevState) => ({
        ...prevState,
        version,
        doc: doc.toString(),
      }));
    };

    fetchData();

    const connectHandler = () => {
      setState((prevState) => ({
        ...prevState,
        connected: true,
      }));
    };

    const disconnectHandler = () => {
      setState((prevState) => ({
        ...prevState,
        connected: false,
      }));
    };

    const displayHandler = async (documentName: string) => {
      const { version, doc } = await getDocument(props.socket, documentName);

      setState((prevState) => ({
        ...prevState,
        version,
        doc: doc.toString(),
        documentName,
      }));
    };

    const changeModeHandler = (event: MediaQueryListEvent) => {
      const mode = event.matches ? 'dark' : 'light';
      setState((prevState) => ({
        ...prevState,
        mode,
      }));
    };

    props.socket.on('connect', connectHandler);
    props.socket.on('disconnect', disconnectHandler);
    props.socket.on('display', displayHandler);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeModeHandler);

    return () => {
      props.socket.off('connect', connectHandler);
      props.socket.off('disconnect', disconnectHandler);
      props.socket.off('display', displayHandler);
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', changeModeHandler);
    };
  }, [props.socket, state.title]);

  editorKey++;

  if (state.version !== null && state.doc !== null) {
    return (
      <CodeMirror
        key={editorKey}
        className={`flex-1 overflow-scroll text-left ${props.className}`}
        height='100%'
        basicSetup={false}
        theme={state.mode}
        extensions={[
          indentUnit.of('\t'),
          basicSetup(),
          langs.c(),
          peerExtension(props.socket, state.title, state.version, state.nickname),
          cursorExtension(state.nickname),
        ]}
        value={state.doc}
      />
    );
  } else {
    return <p>loading...</p>;
  }
}

export default EditorMulti;
