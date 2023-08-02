import { defaultKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { indentUnit, foldGutter } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { keymap, EditorView, placeholder } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useState, useRef } from 'react';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { userColor } from '@/utils/userTagColors';

interface Props {
  provider?: WebsocketProvider;
  handleProvider?: (provider: WebsocketProvider) => void;
  title: string;
  viewer: string;
  setViewer: (viewer: string) => void;
  nickname: string;
  isSubmit: boolean;
}

const EditorCodeMirror: React.FC<Props> = ({
  provider,
  handleProvider,
  // title,
  viewer,
  nickname,
  isSubmit,
}) => {
  const roomName = `${viewer}`;
  const editor = useRef(null);

  const [ydoc, setYdoc] = useState<null | Y.Doc>(null);

  useEffect(() => {
    setYdoc(new Y.Doc());
  }, []);

  const [ytext, setYtext] = useState(ydoc.getText('codemirror'));

  useEffect(() => {
    if (!ydoc) return;
    handleProvider(
      new WebsocketProvider(
        'ws://localhost:8000',
        roomName,
        ydoc,
        // { params: { auth: editorName } } // Specify a query-string that will be url-encoded and attached to the `serverUrl`
      ),
    );
  }, [ydoc]);

  useEffect(() => {
    if (!provider || !ydoc) return;
    provider.on('status', (event: any) => {
      console.error(event.status);
    });
    setYtext(ydoc.getText('codemirror'));
  }, [provider]);

  useEffect(() => {
    if (!ytext) return;
    if (!provider) return;
    provider.awareness.setLocalStateField('user', {
      name: nickname,
      color: userColor.color,
      colorLight: userColor.light,
      roomName: roomName,
      clientID: provider.awareness.clientID,
    });
  }, [ytext]);

  useEffect(() => {
    if (!provider) return;

    const editorPlaceHolder = `print("hello codewarts")  # 디폴트 언어는 python입니다`;

    /* editor instance 생성; state, view 생성 */
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        python(),
        yCollab(ytext, provider.awareness),
        keymap.of([...yUndoManagerKeymap, indentWithTab]),
        keymap.of(standardKeymap),
        keymap.of(defaultKeymap),
        indentUnit.of('\t'),
        foldGutter(),
        placeholder(editorPlaceHolder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ contenteditable: !isSubmit }),
      ],
    });

    if (!editor.current) return;

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    return () => view?.destroy();
  }, [ydoc, provider, viewer]);

  return (
    <div>
      <div
        className='codemirror-editor'
        ref={editor}
        style={{
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
          marginBottom: '10px',
        }}
      />
    </div>
  );
};

export default EditorCodeMirror;
