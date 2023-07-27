import { indentUnit } from '@codemirror/language';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { type Socket } from 'socket.io-client';

import { peerExtension, getDocument } from '@/utils/collab';
import { cursorExtension } from '@/utils/cursors';

// type Mode = 'light' | 'dark';

type Props = {
  socket: Socket;
  className?: string;
  handleEditorCode: (code: string) => void;
};

const EditorIDE = ({ socket, className, handleEditorCode }: Props) => {
  const location = useLocation();
  const { nickname, title } = location.state;
  const [connected, setConnected] = useState(false);
  const [version, setVersion] = useState<number | null>(null);
  const [doc, setDoc] = useState<string | null>(null);
  // const [mode, setMode] = useState<Mode>('dark');

  // return (
  //   <CodeMirror
  //     className={`flex-1 overflow-scroll text-left ${className}`}
  //     basicSetup={false}
  //     onChange={(value) => handleEditorCode(value)}
  //     id='codeEditor'
  //     theme={'dark'}
  //     extensions={[indentUnit.of('\t'), basicSetup(), langs.python()]}
  //   />
  // );

  useEffect(() => {
    const fetchDocument = async () => {
      const { version, doc } = await getDocument(socket, title);
      setVersion(version);
      setDoc(doc.toString());
    };
    fetchDocument();

    const handleConnect = () => {
      console.error(connected);
      setConnected(true);
    };
    const handleDisconnect = () => {
      setConnected(false);
    };
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  if (version !== null && doc !== null) {
    return (
      <CodeMirror
        className={`flex-1 overflow-scroll text-left ${className}`}
        basicSetup={false}
        id='codeEditor'
        theme={'dark'}
        onChange={(value) => handleEditorCode(value)}
        extensions={[
          indentUnit.of('\t'),
          basicSetup(),
          langs.python(),
          peerExtension(socket, title, version, nickname),
          cursorExtension(nickname),
        ]}
        value={doc}
      />
    );
  } else {
    return <span>loading...</span>;
  }
};

export default EditorIDE;
