export enum RuleKeys {
    WarningTextSizeShouldBeEqual = 'warningTextSizeShouldBeEqual',
    WarningInvalidButtonSize = 'warningInvalidButtonSize',
    WarningInvalidPlaceholderSize = 'warningInvalidPlaceholderSize',
    WarningInvalidButtonPosition = 'warningInvalidButtonPosition',
    GridTooMuchMarketingBlocks = 'gidTooMuchMarketingBlocks',
    TextSeveralH1 = 'textSeveralH1',
    TextInvalidH2Position = 'textInvalidH2Position',
    TextInvalidH3Position = 'textInvalidH3Position',
}

export enum Severity {
    Error = "Error", 
    Warning = "Warning", 
    Information = "Information", 
    Hint = "Hint", 
    None = "None"
}

export interface SeverityConfiguration {
    [RuleKeys.WarningTextSizeShouldBeEqual]: Severity;
    [RuleKeys.WarningInvalidPlaceholderSize]: Severity;
    [RuleKeys.WarningInvalidButtonSize]: Severity;
    [RuleKeys.WarningInvalidButtonPosition]: Severity;
    [RuleKeys.GridTooMuchMarketingBlocks]: Severity;
    [RuleKeys.TextSeveralH1]: Severity;
    [RuleKeys.TextInvalidH3Position]: Severity;
    [RuleKeys.TextInvalidH2Position]: Severity;
}

export interface ExampleConfiguration {
 
    enable: boolean;
 
    severity: SeverityConfiguration;
}
