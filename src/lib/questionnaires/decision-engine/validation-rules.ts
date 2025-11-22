import { ValidationRule } from './types'

export const VALIDATION_RULES: ValidationRule[] = [
	{
		id: 'V1_NO_CSRD_FOR_SMALL_PRIVATE',
		description: 'CSRD неприменима к малым частным компаниям',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PRIVATE' },
			{ type: 'anyOf', questionId: 'Q0.3', values: ['EMP_<50', 'EMP_50_249'] },
			{ type: 'anyOf', questionId: 'Q0.4', values: ['REV_<10M', 'REV_10_40M'] },
		],
		effects: [
			{ type: 'forbid-report', reportId: 'CSRD' },
		],
	},
	{
		id: 'V2_NO_CBAM_WITHOUT_EXPORT',
		description: 'CBAM не предлагаем, если экспорта в ЕС нет',
		conditions: [
			{ type: 'equals', questionId: 'Q9.1', value: 'NO' },
		],
		effects: [
			{ type: 'forbid-report', reportId: 'CBAM' },
			{ type: 'forbid-report', reportId: 'CBAM_REPORT' },
			{ type: 'forbid-report', reportId: 'CBAM_ALLOWANCES' },
			{ type: 'forbid-report', reportId: 'CBAM_DATA_PACKAGE' },
			{ type: 'forbid-report', reportId: 'CBAM_PREP_METHOD' },
		],
	},
	{
		id: 'V3_NO_CORSIA_IF_NOT_AVIATION',
		description: 'CORSIA только для авиации',
		conditions: [
			{ type: 'notEquals', questionId: 'Q0.2', value: 'AVIATION' },
			{ type: 'reportSelected', reportId: 'CORSIA' },
		],
		effects: [
			{ type: 'forbid-report', reportId: 'CORSIA' },
		],
	},
	{
		id: 'V4_UNREALISTIC_SCOPE3_IN_SHORT_TIME',
		description: 'Слишком короткие сроки для полной Scope 3 отчётности',
		conditions: [
			{ type: 'equals', questionId: 'Q10.1', value: '<=2M' },
			{
				type: 'anyReportSelected',
				reportIds: ['CSRD', 'SBTI_COMMITMENT', 'CORP_GHG', 'CORP_GHG_VERIFIED', 'SCOPE3_DETAILED'],
			},
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'TIME_UNREALISTIC_FOR_FULL_SCOPE3',
				message: 'Полный Scope 3 обычно занимает >2 месяцев — проверьте сроки.',
			},
		],
	},
	{
		id: 'V5_LOW_BUDGET_VS_EXPENSIVE_CERTS',
		description: 'Низкий бюджет не покрывает дорогие сертификации',
		conditions: [
			{ type: 'equals', questionId: 'Q10.3', value: 'LOW' },
			{
				type: 'anyReportSelected',
				reportIds: ['ISO_14064_CERT', 'EPD_OR_ISO_14067', 'CSRD'],
			},
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'BUDGET_TOO_LOW_FOR_CERTIFICATION',
				message: 'Выбранные сертификации потребуют большего бюджета.',
			},
		],
	},
	{
		id: 'V6_PRODUCT_ONLY_AVOIDS_CORP',
		description: 'Если клиент просит только продукт, корпоративный отчёт опционален',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'PRODUCT_INFO' },
			{ type: 'excludes', questionId: 'Q3.1', value: 'COMPANY_INFO' },
			{ type: 'reportSelected', reportId: 'CORP_GHG' },
		],
		effects: [
			{ type: 'downgrade-priority', reportId: 'CORP_GHG', to: 'MEDIUM' },
		],
	},
	{
		id: 'V7_SCOPE3_REQUIRED_FOR_SBTI',
		description: 'SBTi требует полного Scope 3',
		conditions: [
			{ type: 'reportSelected', reportId: 'SBTI_COMMITMENT' },
			{ type: 'notEquals', questionId: 'Q8.3', value: 'SCOPE3_FULL' },
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'SCOPE3_REQUIRED_FOR_SBTI',
				message: 'Для SBTi нужен полный Scope 3 — обновите границы учёта.',
			},
		],
	},
	{
		id: 'V8_SCOPE3_DATA_NEEDED',
		description: 'Отчёт требует Scope 3, но компания его не считает',
		conditions: [
			{ type: 'equals', questionId: 'Q8.3', value: 'SCOPE1_2_ONLY' },
			{
				type: 'anyReportSelected',
				reportIds: ['CSRD', 'SBTI_COMMITMENT', 'SCOPE3_DETAILED', 'CLIENT_SCOPE3_PACKAGE', 'PRODUCT_PCF'],
			},
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'SCOPE3_DATA_NEEDED',
				message: 'Выбранные отчёты потребуют данных Scope 3.',
			},
		],
	},
	{
		id: 'V9_DUPLICATE_CDP_SOURCES',
		description: 'CDP запрошен и клиентом, и программой',
		conditions: [
			{ type: 'equals', questionId: 'Q3.2', value: 'CDP' },
			{ type: 'includes', questionId: 'Q5.1', value: 'CDP' },
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'CDP_DUPLICATE_SOURCE',
				message: 'CDP требуется сразу несколькими инициаторами — можно объединить работу.',
			},
		],
	},
	{
		id: 'V12_VERIFICATION_REQUIRED_BUT_REFUSED',
		description: 'Когда отчёты требуют верификации, но ответили что она не нужна',
		conditions: [
			{ type: 'equals', questionId: 'Q7.2a', value: 'VERIFICATION_NOT_REQUIRED' },
			{
				type: 'anyReportSelected',
				reportIds: ['CSRD', 'CBAM', 'ISO_14064_CERT', 'EPD_OR_ISO_14067', 'CORP_GHG_VERIFIED'],
			},
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'VERIFICATION_MANDATORY',
				message: 'Некоторые выбранные отчёты требуют обязательной верификации.',
			},
		],
	},
]
