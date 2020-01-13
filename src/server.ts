
import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    InitializeParams,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams
} from 'vscode-languageserver';

import { basename } from 'path';



import { ExampleConfiguration, Severity, RuleKeys } from './configuration';
import  { lint, RuleList }  from './linter';

let conn = createConnection(ProposedFeatures.all);
let docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;


conn.onInitialize((params: InitializeParams) => {
    let capabilities = params.capabilities;
    return {
        capabilities: {
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});


// Так-как у меня все переборы происходят в моем линтере я решил пойти таким путем
const getRulesKeys = (key: any): RuleList<RuleKeys> => {
    switch(key) {
        case RuleKeys.WarningInvalidButtonPosition: 
            return { key: RuleKeys.WarningInvalidButtonPosition};
        case RuleKeys.WarningInvalidButtonSize:
            return { key: RuleKeys.WarningInvalidButtonSize};
        case RuleKeys.WarningInvalidPlaceholderSize:
            return { key: RuleKeys.WarningInvalidPlaceholderSize};
        case RuleKeys.WarningTextSizeShouldBeEqual: 
            return { key: RuleKeys.WarningTextSizeShouldBeEqual};
        case RuleKeys.GridTooMuchMarketingBlocks:
            return {key: RuleKeys.GridTooMuchMarketingBlocks};
        case RuleKeys.TextSeveralH1:
            return {key: RuleKeys.TextSeveralH1};
        case RuleKeys.TextInvalidH2Position:
            return {key: RuleKeys.TextInvalidH2Position};
        case RuleKeys.TextInvalidH3Position:
            return {key: RuleKeys.TextInvalidH3Position};
    }
    
    return key;
};


function GetSeverity(key: RuleKeys): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }
   
    const severity: Severity = conf.severity[key];
    console.log(severity);
    
    switch (severity) {
        case Severity.Error:
            return DiagnosticSeverity.Error;
        case Severity.Warning:
            return DiagnosticSeverity.Warning;
        case Severity.Information:
            return DiagnosticSeverity.Information;
        case Severity.Hint:
            return DiagnosticSeverity.Hint;
        default:
            return undefined;
    }
}

function GetMessage(key: RuleKeys): string {

    if(key === RuleKeys.WarningTextSizeShouldBeEqual) {
        return "Все тексты (блоки text) в блоке warning должны быть одного размера";
    }

    if(key === RuleKeys.WarningInvalidButtonSize) {
        return "Размер кнопки блока warning должен быть на 1 шаг больше текста" + 
        "(например, для размера l таким значением будет xl)";
    }

    
    if(key === RuleKeys.WarningInvalidPlaceholderSize) {
        return "Допустимые размеры для блока placeholder в блоке warning " +
        "(значение модификатора size): s, m, l";
    }

    if(key === RuleKeys.WarningInvalidButtonPosition) {
        return "Блок button в блоке warning не может находиться перед блоком placeholder" +
        "на том же или более глубоком уровне вложенности";
    }

    if(key === RuleKeys.GridTooMuchMarketingBlocks) {
        return "Слишком много макркетинговых блоков в Grid";
    }

    if(key === RuleKeys.TextSeveralH1) {
        return "Заголовок первого уровня (блок text с модификатором type h1)" +
        "на странице должен быть единственным";
    }

    if(key === RuleKeys.TextInvalidH2Position) {
        return "Заголовок второго уровня (блок text с модификатором type h2)" + 
        "не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности";
    }

    if(key === RuleKeys.TextInvalidH3Position ) {
        return "Заголовок третьего уровня (блок text с модификатором type h3)" +
        "не может находиться перед заголовком второго уровня на том же или более глубоком" +
        "Sуровне вложенности";
    }

    return `Unknown problem type '${key}'`;
}


async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    try {
        const source = basename(textDocument.uri);
        console.log(source);
       
        // Get json string insted of uri. We need json string
        const json = textDocument.getText();
   
    
        const diagnostics: Diagnostic[] = lint(json).reduce(
            (
                list: Diagnostic[],
                problem
            ): Diagnostic[] => {  
                let rules =  getRulesKeys(problem.key);
       
                const severity = GetSeverity(rules.key);
                if (severity) {
                 
                    const message = GetMessage(rules.key);
                    let diagnostic: Diagnostic = {
                        range: {
                            start: textDocument.positionAt(
                        
                                problem.loc.start.offset
                            ),
                            end: textDocument.positionAt(problem.loc.end.offset)
                        },
                        severity,
                        message,
                        source
                    };

                    list.push(diagnostic);
                }
                
                return list;
            },
            []
        );

         conn.sendDiagnostics({ uri: textDocument.uri, diagnostics });

    } catch(err) {
        console.log(err);
    }
}


async function validateAll() {
    for (const document of docs.all()) {
      await validateTextDocument(document);
    }
}

docs.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
