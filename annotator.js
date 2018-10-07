window.onload = function () {
    let mouse_x, mouse_y;
    const selection = window.getSelection();

    const btn = document.querySelector('#annotator_btn');
    const block = document.querySelector('#annotator_block');
    const input = document.querySelector('#annotator_text');
    const btn_submit = document.querySelector('#annotator_btn_submit');
    const SelectionEnd = new Event('selectionend');
    let selectionEndTimeout;

    const init = () => {
        document.addEventListener('selectionchange', userSelectionChanged);
        document.addEventListener('selectionend', selectionEnd);
        document.addEventListener('mouseup', onMouseUpdate);
        btn.addEventListener('click', displayAnnotatorBlock);
        btn_submit.addEventListener('click', submitAnnotator);
        console.log('annotator init')
    };

    const submitAnnotator = () => {
        block.style.display = 'none';
        const selected_text = document.getElementById('selected_text');
        selected_text.setAttribute('data-annotation', input.value);
        selected_text.removeAttribute('id');
        input.value = '';
    };

    const onMouseUpdate = (e) => {
        mouse_x = e.pageX;
        mouse_y = e.pageY;
    };

    const displayAnnotatorBlock = () => {
        btn.style.display = 'none';

        block.style.top = `${mouse_y}px`;
        block.style.left = `${mouse_x}px`;
        block.style.display = 'block';
    };

    const userSelectionChanged = () => {
        if (selection.anchorNode !== block) {
            block.style.display = 'none';
        }
        // wait 250 ms after the last selection change event
        if (selectionEndTimeout) {
            clearTimeout(selectionEndTimeout);
        }
        selectionEndTimeout = setTimeout(() => {
            document.dispatchEvent(SelectionEnd);
        }, 250);
    };

    const selectionEnd = () => {
        selectionEndTimeout = null;
        if (!selection.isCollapsed) { // Selection not empty
            // console.log(selection);
            if (selection.anchorNode === selection.focusNode) {
                // Selection begins and ends in the same node
                btn.style.top = `${mouse_y}px`;
                btn.style.left = `${mouse_x}px`;
                btn.style.display = 'block';
                let start, end;
                if (selection.anchorOffset < selection.focusOffset) {
                    start = selection.anchorOffset;
                    end = selection.focusOffset;
                } else {
                    start = selection.focusOffset;
                    end = selection.anchorOffset;
                }
                const selectionText = selection.toString();
                const replacementNode = document.createElement('span');
                const selected_text = document.getElementById('selected_text');
                if (selected_text) {
                    if (selected_text.innerText !== selectionText) {
                        selected_text.replaceWith(selected_text.innerHTML);
                    } else {
                        selected_text.removeAttribute('id'); // Nested spans issue
                    }
                }
                replacementNode.setAttribute('id', 'selected_text');
                replacementNode.innerHTML = selectionText;
                let splitted = selection.anchorNode.splitText(start).splitText(end - start);
                selection.anchorNode.parentNode.insertBefore(replacementNode, splitted.previousSibling);
                selection.anchorNode.parentNode.removeChild(splitted.previousSibling);
            }
        } else {
            btn.style.display = 'none';
        }
    };

    const consoleParent = (node) => {
        if (node.parentElement && node.parentElement.nodeName !== 'BODY') {
            console.log(node.parentElement);
            consoleParent(node.parentElement);
        }
    };

    init();
};