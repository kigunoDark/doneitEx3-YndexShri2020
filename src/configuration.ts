export enum RuleKeys {
    UppercaseNamesIsForbidden = 'uppercaseNamesIsForbidden',
    BlockNameIsRequired = 'blockNameIsRequired',
    WarningTExtSizeShouldBeEqual = 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL'
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
    [RuleKeys.WarningTExtSizeShouldBeEqual]:Severity;
}

export interface ExampleConfiguration {
 
    enable: boolean;
 
    severity: SeverityConfiguration;
}
