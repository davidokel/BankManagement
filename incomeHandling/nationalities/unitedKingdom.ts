enum StudentLoanScheme {
    noLoan,
    plan1,
    plan2,
    plan4,
    postGraduate,
}

enum NationalInsuranceClassification {
    employed,
    selfEmployed,
}

class UnitedKingdomIncome extends IncomeStream implements IIncomeSteam {
    nationalInsuranceClass: NationalInsuranceClassification;
    studentLoanScheme: StudentLoanScheme;

    constructor(period: TimePeriod, incomeAmount: number, numberOfPeriods: number = 0, pensionPlan: number, studentLoanType: StudentLoanScheme = StudentLoanScheme.noLoan, nationalInsuranceClass: NationalInsuranceClassification = NationalInsuranceClassification.employed) {
        const taxSystem = {
            taxAllowance: 12570,
            taxBrackets: [
                {upperCutOff: 37700, percentage: 0.2},
                {upperCutOff: 150000, percentage: 0.45}],
            maxTaxRate: 0.45,
        }
        super(period, incomeAmount, numberOfPeriods, pensionPlan, taxSystem);

        this.nationalInsuranceClass = nationalInsuranceClass;
        this.studentLoanScheme = studentLoanType;
    }

    get netAnnualIncome(): number {
        return super.netAnnualIncome - this.nationalInsuranceDeductions - this.studentLoanDeductions;
    }

    get nationalInsuranceDeductions(): number {
        switch (this.nationalInsuranceClass) {
            case NationalInsuranceClassification.employed:
                return this.nationalInsuranceClassOneDeductions();
            case NationalInsuranceClassification.selfEmployed:
                return this.nationalInsuranceClassTwoFourDeductions();
        }
    }

    get studentLoanDeductions(): number {
        switch (this.studentLoanScheme) {
            case StudentLoanScheme.noLoan:
                return 0;
            case StudentLoanScheme.plan1:
                return this.calculateStudentLoanDeductions(388, 0.09);
            case StudentLoanScheme.plan2:
                return this.calculateStudentLoanDeductions(524,0.09);
            case StudentLoanScheme.plan4:
                return this.calculateStudentLoanDeductions(487,0.09);
            case StudentLoanScheme.postGraduate:
                return this.calculateStudentLoanDeductions(403,0.06);
        }
    }

    private calculateStudentLoanDeductions(cutOff: number, rate: number): number {
        const weeklyRate = this.weeklyGrossIncome; //todo implement if multiple loans are being repaid

        if (weeklyRate < cutOff) {
            return 0;
        }

        return (weeklyRate - cutOff) * rate * 52;
    }

    private nationalInsuranceClassOneDeductions(): number {
        const lowerCutOff = 190;
        const lowerRate = 0.1325;
        const upperCutOff = 967;
        const higherRate = 0.0325;
        const weeklyRate = this.weeklyGrossIncome;
        let weeklyDeductions;

        if (weeklyRate <= lowerCutOff) {
            return 0;
        } else if (weeklyRate <= upperCutOff) {
            weeklyDeductions = (weeklyRate - lowerCutOff) * lowerRate;
        } else {
            weeklyDeductions = (upperCutOff - lowerCutOff) * lowerRate + (weeklyRate - upperCutOff) * higherRate;
        }
        return weeklyDeductions * 52;
    }

    private nationalInsuranceClassTwoFourDeductions(): number {
        const classTwoCutOff = 6725;
        const classTwoRate = 3.15 //Pounds per week - fixed rate
        const classFourLowerCutOff = 9881;
        const classFourLowerRate = 0.1025;
        const classFourUpperCutOff = 50270;
        const classFourUpperRate = 0.0325;

        let annualDeductions;
        const annualIncome = this.grossAnnualIncome;

        if (annualIncome < classTwoCutOff) {
            return 0;
        }

        annualDeductions = classTwoRate * 52;

        if (annualIncome < classFourLowerCutOff) {
            return annualDeductions;
        } else if (annualIncome < classFourUpperCutOff) {
            annualDeductions += (annualIncome - classFourLowerCutOff) * classFourLowerRate;
        } else {
            annualDeductions += (classFourUpperCutOff - classFourLowerCutOff) * classFourLowerRate + (annualIncome - classFourUpperCutOff) * classFourUpperRate;
        }
        return annualDeductions;
    }
}