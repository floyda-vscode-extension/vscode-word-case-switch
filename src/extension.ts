import * as vscode from "vscode"
import * as Case from "case"

enum CaseType {
    snake,
    constant,
    camel,
    pascal,
}

function checkWordCase(content: string): CaseType {
    if (Case.of(content) === "snake") return CaseType.snake
    if (Case.of(content) === "constant") return CaseType.constant
    if (Case.of(content) === "camel") return CaseType.camel
    if (Case.of(content) === "pascal") return CaseType.pascal
    return CaseType.snake
}

function switchWord(content: string, caseType: number = 0): string {
    let result = ""
    switch (caseType) {
        case CaseType.snake:
            result = Case.snake(content)
            break
        case CaseType.constant:
            result = Case.constant(content)
            break
        case CaseType.camel:
            result = Case.camel(content)
            break
        case CaseType.pascal:
            result = Case.pascal(content)
            break
        default:
            return Case.snake(content)
    }
    if (result == content) {
        return switchWord(content, caseType + 1)
    }
    return result
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "word-case-switch" is now active!')

    let disposable = vscode.commands.registerCommand("word-case-switch.run", () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return
        }

        const selections = editor.selections
        editor.edit((builder: vscode.TextEditorEdit) => {
            selections.forEach((selection: vscode.Selection) => {
                let _range: vscode.Range | undefined = editor.document.getWordRangeAtPosition(selection.active)
                if (_range !== undefined) {
                    let _text = editor.document.getText(_range)
                    let _caseType = checkWordCase(_text)
                    _text = switchWord(_text, _caseType)
                    builder.replace(_range, _text)
                }
            })
        })
    })

    context.subscriptions.push(disposable)
}

export function deactivate() {}
