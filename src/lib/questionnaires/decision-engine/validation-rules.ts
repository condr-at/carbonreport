import { ValidationRule } from './types'

export const VALIDATION_RULES: ValidationRule[] = [
	{
		id: 'V1_NO_CSRD_FOR_SMALL_PRIVATE',
		description: 'Размер отдельной компании не подтверждает освобождение от всех CSRD group/period obligations',
		conditions: [
			{ type: 'reportSelected', reportId: 'CSRD' },
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PRIVATE' },
			{ type: 'anyOf', questionId: 'Q0.3', values: ['EMP_<50', 'EMP_50_249'] },
			{ type: 'anyOf', questionId: 'Q0.4', values: ['REV_<10M', 'REV_10_40M'] },
		],
		effects: [
			{ type: 'add-warning', warningCode: 'CSRD_SCOPE_REVIEW', message: 'Company size alone does not establish an exemption. Confirm the group, reporting year and local CSRD rules.' },
		],
	},
	{
		id: 'V2_NO_CBAM_WITHOUT_EXPORT',
		description: 'Отсутствие экспорта не исключает роль импортёра CBAM или прямо заявленный запрос',
		conditions: [
			{ type: 'anyReportSelected', reportIds: ['CBAM', 'CBAM_REPORT', 'CBAM_DATA_PACKAGE', 'CBAM_ALLOWANCES'] },
			{ type: 'equals', questionId: 'Q9.1', value: 'NO' },
		],
		effects: [
			{ type: 'add-warning', warningCode: 'CBAM_TRADE_ROLE_REVIEW', message: 'No exports does not establish a CBAM exemption. Confirm the import, customs role and goods covered by the request.' },
		],
	},
	{
		id: 'V3_NO_CORSIA_IF_NOT_AVIATION',
		description: 'Проверить фактическую операторскую роль при несовпадении отрасли',
		conditions: [
			{ type: 'notEquals', questionId: 'Q0.2', value: 'AVIATION' },
			{ type: 'reportSelected', reportId: 'CORSIA' },
		],
		effects: [
			{ type: 'add-warning', warningCode: 'CORSIA_OPERATOR_REVIEW', message: 'Confirm the aeroplane operator and State attribution; an industry label is not an applicability determination.' },
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
		description: 'Нужно согласовать бюджет независимой проверки или публикации',
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
				message: 'Согласуйте объём и стоимость внешней проверки, assurance или публикации с выбранным исполнителем.',
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
		description: 'Границы SBTi зависят от версии стандарта и выбранного маршрута',
		conditions: [
			{ type: 'reportSelected', reportId: 'SBTI_COMMITMENT' },
			{ type: 'notEquals', questionId: 'Q8.3', value: 'SCOPE3_FULL' },
		],
		effects: [
			{
				type: 'add-warning',
				warningCode: 'SCOPE3_REQUIRED_FOR_SBTI',
				message: 'Проверьте границы и требования Scope 3 для выбранной версии SBTi и sector/SME route; общий ответ анкеты их не подтверждает.',
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
				message: 'Проверьте данные цепочки стоимости, границы и категории, необходимые для выбранного результата; корпоративный Scope 3 и PCF не взаимозаменяемы.',
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
		description: 'Проверить внешнюю верификацию по выбранной схеме и применимости',
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
				message: 'Проверьте требования к независимой верификации или assurance для выбранного режима, данных и получателя; генерация отчёта не выполняет эту проверку.',
			},
		],
	},
]
