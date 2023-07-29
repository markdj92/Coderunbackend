import { indentUnit } from '@codemirror/language';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useState, useEffect } from 'react';
import { type Socket } from 'socket.io-client';

import { peerExtension, getDocument } from '@/utils/collab';
import { cursorExtension } from '@/utils/cursors';
import { generateName } from '@/utils/usernames';

type Props = {
  socket: Socket;
  className?: string;
  title: string;
  nickname: string;
};

const username = generateName();

const EditorMulti: React.FC<Props> = ({ socket, className }) => {
  const [version, setVersion] = useState<number | null>(null);
  const [doc, setDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const { version, doc } = await getDocument(socket);
      setVersion(version);
      setDoc(doc.toString());
    };
    fetchDocument();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pullUpdateResponse');
      socket.off('pushUpdateResponse');
      socket.off('getDocumentResponse');
    };
  }, [socket]);

  if (version !== null && doc !== null) {
    return (
      <>
        <CodeMirror
          className={`flex-1 overflow-scroll text-left ${className}`}
          height='100%'
          basicSetup={false}
          id='codeEditor'
          theme={'dark'}
          extensions={[
            indentUnit.of('\t'),
            basicSetup(),
            langs.c(),
            peerExtension(socket, version, username),
            cursorExtension(username),
          ]}
          value={doc}
        />
      </>
    );
  } else {
    return <span>loading...</span>;
  }
};

export default EditorMulti;
