enum StudentLoanScheme {
    noLoan,
    type1,
    type2,
}

enum NationalInsuranceClassification {
    classOne,
    classTwo,
    classThree,
    classFour,
}

class UnitedKingdomIncome extends IncomeStream implements IIncomeSteam {
    nationalInsuranceClass: NationalInsuranceClassification;
    studentLoanScheme: StudentLoanScheme;

    constructor(studentLoanType: StudentLoanScheme, nationalInsuranceClass: NationalInsuranceClassification, period: TimePeriod, incomeAmount: number, numberOfPeriods: number = 0, pensionPlan: number) {
        const taxSystem = {
            taxAllowance: 12570,
            taxBrackets: [
                {upperCutOff: 37700, percentage: 20},
                {upperCutOff: 150000, percentage: 45}],
            maxTaxRate: 45,
        }
        super(period, incomeAmount, numberOfPeriods, pensionPlan, taxSystem);

        this.nationalInsuranceClass = nationalInsuranceClass;
        this.studentLoanScheme = studentLoanType;
    }

    get netIncome(): number {
        return super.netIncome - this.nationalInsuranceDeductions - this.studentLoanDeductions;
    }

    get nationalInsuranceDeductions(): number {
        return 0;
    }

    get studentLoanDeductions(): number {
        return 0;
    }
}