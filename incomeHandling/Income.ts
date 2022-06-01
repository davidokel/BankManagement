enum TimePeriod {
    Hourly,
    Daily,
    Weekly,
    Monthly,
    Yearly,
}

type TaxSystem = {
    taxAllowance: number,
    taxBrackets: Array<{upperCutOff: number, percentage: number}>,
    maxTaxRate: number,
}

interface IIncomeSteam {
    readonly grossAnnualIncome: number;
    readonly netIncome: number;
    readonly taxDeductions: number;
}

class IncomeStream {
    protected readonly taxSystem: TaxSystem;
    readonly annualPensionContribution;
    grossAnnualIncome: number;

    /**
     *
     * @param period
     * @param incomeAmount
     * @param numberOfPeriods Hours/Days worked per week
     * @param pensionPlan pass as percentage value (full not divided by 100)
     * @param taxSystem
     */
    constructor(period: TimePeriod, incomeAmount: number, numberOfPeriods: number = 0, pensionPlan: number, taxSystem: TaxSystem) {
        if ((period === TimePeriod.Daily || period === TimePeriod.Hourly) && numberOfPeriods === 0) {
            throw new Error("Please pass the number of periods if using daily or hourly rate")
        }
        if (pensionPlan >= 100 || pensionPlan < 0) {
            throw new Error("Pension rate is unacceptable")
        }

        this.taxSystem = taxSystem;

        let annualRate;
        switch (period) {
            case TimePeriod.Hourly:
            case TimePeriod.Daily:
                annualRate = incomeAmount * numberOfPeriods * 52;
                break;
            case TimePeriod.Weekly:
                annualRate = incomeAmount * 52;
                break;
            case TimePeriod.Monthly:
                annualRate = incomeAmount * 12;
                break;
            case TimePeriod.Yearly:
                annualRate = incomeAmount;
                break;
        }
        this.grossAnnualIncome = annualRate;
        this.annualPensionContribution = annualRate * (pensionPlan / 100);
    }

    get netIncome(): number {
        return this.grossAnnualIncome - this.taxDeductions - this.annualPensionContribution;
    }

    get taxDeductions(): number {
        let taxableIncome = this.grossAnnualIncome - this.taxSystem.taxAllowance;
        let deductions = 0;
        for (const bracket of this.taxSystem.taxBrackets) {
            let incomeInBracket = taxableIncome > bracket.upperCutOff? bracket.upperCutOff : taxableIncome;
            deductions += incomeInBracket * (bracket.percentage)/100;
            taxableIncome -= incomeInBracket;
        }
        if (taxableIncome > 0) {
            deductions += taxableIncome * (this.taxSystem.maxTaxRate)/100;
        }

        return deductions;
    }



}

