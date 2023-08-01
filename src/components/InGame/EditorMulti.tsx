import { indentUnit } from '@codemirror/language';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

import { getDocument, peerExtension } from '@/utils/collab';
import { cursorExtension } from '@/utils/cursors';

type Mode = 'light' | 'dark';

type EditorMultiProps = {
  socket: Socket;
  className?: string;
  viewer: string;
  nickname: string;
};

type EditorMultiState = {
  connected: boolean;
  version: number | null;
  viewer: string;
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
    viewer: props.viewer,
    nickname: props.nickname,
    mode: 'dark',
  });

  const editorRef = useRef<ReactCodeMirrorRef>();

  function refCallback(editor: ReactCodeMirrorRef) {
    if (!editorRef.current && editor?.editor && editor?.state && editor?.view) {
      editorRef.current = editor;
    }
  }

  useEffect(() => {
    async function fetchData() {
      const { version, doc } = await getDocument(props.socket, state.viewer);

      setState((prevState) => ({
        ...prevState,
        version,
        doc: doc.toString(),
      }));
    }

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

    const displayHandler = async (viewer: string) => {
      const { version, doc } = await getDocument(props.socket, viewer);
      setState((prevState) => ({
        ...prevState,
        version,
        doc: doc.toString(),
        viewer,
      }));
    };

    props.socket.on('connect', connectHandler);
    props.socket.on('disconnect', disconnectHandler);
    props.socket.on('display', displayHandler);

    return () => {
      props.socket.off('connect', connectHandler);
      props.socket.off('disconnect', disconnectHandler);
      props.socket.off('display', displayHandler);
    };
  }, [props.socket, state.viewer]);

  editorKey++;

  if (state.version !== null && state.doc !== null) {
    return (
      <CodeMirror
        key={editorKey}
        ref={refCallback}
        className={`flex-1 overflow-scroll text-left ${props.className}`}
        height='100%'
        basicSetup={false}
        theme={state.mode}
        readOnly={false}
        extensions={[
          indentUnit.of('\t'),
          basicSetup(),
          langs.python(),
          peerExtension(props.socket, state.version, state.viewer, state.nickname),
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
