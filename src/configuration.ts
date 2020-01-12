export enum RuleKeys {
    UppercaseNamesIsForbidden = 'uppercaseNamesIsForbidden',
    BlockNameIsRequired = 'blockNameIsRequired',
    WarningTextSizeShouldBeEqual = 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
    WarningInvalidButtonSize = 'WARNING.INVALID_BUTTON_SIZE',
    WarningInvalidPlaceholderSize = 'WARNING.INVALID_PLACEHOLDER_SIZE',
    WarningInvalidButtonPosition = 'WARNING.INVALID_BUTTON_POSITION',
    GridTooMuchMarketingBlocks = 'GRID.TOO_MUCH_MARKETING_BLOCKS',
    TextSeveralH1 = 'TEXT.SEVERAL_H1',
    TextInvalidH2Position = 'TEXT.INVALID_H2_POSITION',
    TextInvalidH3Position = 'TEXT.INVALID_H3_POSITION',
}

export enum Severity {
    Error = "Error", 
    Warning = "Warning", 
    Information = "Information", 
    Hint = "Hint", 
    None = "None"
}

export interface SeverityConfiguration {
    [RuleKeys.BlockNameIsRequired]: Severity;
    [RuleKeys.UppercaseNamesIsForbidden]: Severity;
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
