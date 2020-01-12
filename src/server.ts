
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
import  { lint }  from './linter';

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

// function GetSeverity(key: RuleKeys): DiagnosticSeverity | undefined {
//     if (!conf || !conf.severity) {
//         return undefined;
//     }

//     const severity: Severity = conf.severity[key];

//     switch (severity) {
//         case Severity.Error:
//             return DiagnosticSeverity.Information;
//         case Severity.Warning:
//             return DiagnosticSeverity.Warning;
//         case Severity.Information:
//             return DiagnosticSeverity.Information;
//         case Severity.Hint:
//             return DiagnosticSeverity.Hint;
//         default:
//             return undefined;
//     }
// }

// function GetMessage(key: RuleKeys): string {
//     if (key === RuleKeys.BlockNameIsRequired) {
//         return 'Field named \'block\' is required!';
//     }

//     if(key = RuleKeys.WARNING_TEXT_SIZES_SHOULD_BE_EQUAL) {
//         return "Hey";
//     }

//     if (key === RuleKeys.UppercaseNamesIsForbidden) {
//         return 'Uppercase properties are forbidden!';
//     }

//     return `Unknown problem type '${key}'`;
// }

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    try {
        const source = basename(textDocument.uri);
    
       
        // Get json string insted of uri. We need json string
        const json = textDocument.getText();
   
        
        // const rules =  lint(json);
        // rules.forEach(function(value:any){
        //     switch (value.key) {
        //         case "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL":
        //        le
        //     }
            
        // });
    
        // const validateWarning = ()

        // const validateObject = (
        //     obj: jsonToAst.AstObject
        // ): LinterProblem<RuleKeys>[] => 
        //   {
        //    return obj.children.some(p => p.key.value === 'block')
        //     ? []
        //     : [{ key: RuleKeys.BlockNameIsRequired, loc: obj.loc }];
        //   }
        
           

        // const validateProperty = (
        //     property: jsonToAst.AstProperty
        // ): LinterProblem<RuleKeys>[] => /^[A-Z]+$/.test(property.key.value)
        //     ? [
        //         {
        //             key: RuleKeys.UppercaseNamesIsForbidden,
        //             loc: property.loc
        //         }
        //     ]
        //     : [];
           

        const diagnostics: Diagnostic[] = lint(json).reduce(
            (
                list: Diagnostic[],
                problem
            ): Diagnostic[] => {
                // const severity = GetSeverity(problem.key);
                // if (severity) {
                //     const message = GetMessage(problem.key);
                    let diagnostic: Diagnostic = {
                        range: {
                            start: textDocument.positionAt(
                        
                                problem.loc.start.offset
                            ),
                            end: textDocument.positionAt(problem.loc.end.offset)
                        },
                        severity: DiagnosticSeverity.Error,
                        message: problem.error,
                        source
                    };
                    
                    list.push(diagnostic);
                // }
                
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
