import { RuleDefinition } from './types'

const CLIENT_INITIATORS = ['CLIENT_EXISTING', 'CLIENT_PROSPECT']
const INTERNAL_INITIATORS = ['INTERNAL_TOP', 'INTERNAL_OTHER']

export const RULES: RuleDefinition[] = [
	// =============================
	// Регуляторные требования (#1–#11)
	// =============================
	{
		id: 'R1_CSRD_SIZE',
		source: '#1',
		description: 'CSRD для публичных компаний ЕС с численностью ≥250',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
			{ type: 'anyOf', questionId: 'Q0.3', values: ['EMP_250_499', 'EMP_500+'] },
		],
		outputs: { reports: ['CSRD'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R1_CSRD_REVENUE',
		source: '#1',
		description: 'CSRD для публичных компаний ЕС с оборотом ≥40 млн €',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
			{ type: 'anyOf', questionId: 'Q0.4', values: ['REV_40_50M', 'REV_>50M'] },
		],
		outputs: { reports: ['CSRD'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R1_CSRD_EXCHANGE',
		source: '#9',
		description: 'CSRD для компаний, листинговых на биржах ЕС',
		conditions: [
			{ type: 'equals', questionId: 'Q6.1', value: 'EU_EXCHANGE' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
		],
		outputs: { reports: ['CSRD'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R2_EU_ETS',
		source: '#2',
		description: 'EU ETS для энергетики и производства в ЕС',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'anyOf', questionId: 'Q0.2', values: ['ENERGY', 'MANUFACTURING'] },
			{ type: 'includes', questionId: 'Q2.2', value: 'EU_ETS' },
		],
		outputs: { reports: ['EU_ETS'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R3_CBAM',
		source: '#3',
		description: 'CBAM при экспорте товаров из списка',
		conditions: [
			{ type: 'anyOf', questionId: 'Q9.1', values: ['YES', 'PLANNED'] },
			{ type: 'includes', questionId: 'Q9.2', value: 'CBAM_GOODS' },
		],
		outputs: { reports: ['CBAM'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R4_UK_SECR',
		source: '#4',
		description: 'SECR для крупных публичных компаний UK',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'UK' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
			{ type: 'anyOf', questionId: 'Q0.3', values: ['EMP_250_499', 'EMP_500+'] },
		],
		outputs: { reports: ['UK_SECR'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R5_SEC_CLIMATE',
		source: '#5',
		description: 'SEC Climate Disclosure для публичных компаний США',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'US' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
			{ type: 'equals', questionId: 'Q6.1', value: 'NYSE_NASDAQ' },
		],
		outputs: { reports: ['SEC_CLIMATE'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R6_CORSIA',
		source: '#6',
		description: 'CORSIA для международной авиации',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'AVIATION' },
			{ type: 'equals', questionId: 'Q11.1', value: 'INTERNATIONAL' },
		],
		outputs: { reports: ['CORSIA'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R7_EU_MRV',
		source: '#7',
		description: 'EU MRV для флота, заходящего в ЕС',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'MARITIME' },
			{ type: 'equals', questionId: 'Q11.2', value: 'EU_PORTS' },
		],
		outputs: { reports: ['EU_MRV'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R8_SFDR',
		source: '#8',
		description: 'SFDR для финансовых организаций ЕС',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'EU' },
			{ type: 'equals', questionId: 'Q0.2', value: 'FINANCE' },
			{ type: 'anyOf', questionId: 'Q0.6', values: ['AUM_500M_1B', 'AUM_>1B'] },
		],
		outputs: { reports: ['SFDR'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R10_UK_TCFD_LISTING',
		source: '#10',
		description: 'UK TCFD при листинге на LSE',
		conditions: [
			{ type: 'equals', questionId: 'Q6.1', value: 'LSE' },
		],
		outputs: { reports: ['UK_TCFD'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R10_UK_TCFD_REQUEST',
		source: '#10',
		description: 'UK TCFD если регулятор указал требование',
		conditions: [
			{ type: 'equals', questionId: 'Q0.1', value: 'UK' },
			{ type: 'includes', questionId: 'Q2.3', value: 'UK_TCFD' },
		],
		outputs: { reports: ['UK_TCFD'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R11_HKEX_ESG',
		source: '#11',
		description: 'HKEX ESG для публичных компаний',
		conditions: [
			{ type: 'equals', questionId: 'Q6.1', value: 'HKEX' },
			{ type: 'equals', questionId: 'Q0.5', value: 'PUBLIC' },
		],
		outputs: { reports: ['HKEX_ESG'], tags: ['REGULATORY_MANDATORY'] },
	},

	// =============================
	// Клиентские требования (#12–#21)
	// =============================
	{
		id: 'R12_CLIENT_ISO14064',
		source: '#12',
		description: 'ISO 14064 по запросу клиента',
		conditions: [
			{ type: 'includesAny', questionId: 'Q1.1', values: CLIENT_INITIATORS },
			{ type: 'includes', questionId: 'Q3.1', value: 'COMPANY_INFO' },
			{ type: 'equals', questionId: 'Q3.2', value: 'ISO_14064' },
		],
		outputs: { reports: ['ISO_14064_CERT'] },
	},
	{
		id: 'R13_CLIENT_CDP',
		source: '#13',
		description: 'CDP по запросу клиента',
		conditions: [
			{ type: 'includesAny', questionId: 'Q1.1', values: CLIENT_INITIATORS },
			{ type: 'equals', questionId: 'Q3.2', value: 'CDP' },
		],
		outputs: { reports: ['CDP_DISCLOSURE'] },
	},
	{
		id: 'R14_CLIENT_CORP_GHG',
		source: '#14',
		description: 'Корпоративный GHG по GHG Protocol',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'COMPANY_INFO' },
			{ type: 'equals', questionId: 'Q3.2', value: 'GHG_PROTOCOL' },
		],
		outputs: { reports: ['CORP_GHG'] },
	},
	{
		id: 'R15_CLIENT_ECOVADIS',
		source: '#15',
		description: 'EcoVadis по запросу клиента',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'COMPANY_INFO' },
			{ type: 'equals', questionId: 'Q3.2', value: 'ECOVADIS' },
		],
		outputs: { reports: ['ECOVADIS_SCORE'] },
	},
	{
		id: 'R16_CLIENT_EPD',
		source: '#16',
		description: 'EPD/ISO 14067 для продукта',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'PRODUCT_INFO' },
			{ type: 'equals', questionId: 'Q3.3a', value: 'CERT_REQUIRED' },
		],
		outputs: { reports: ['EPD_OR_ISO_14067'] },
	},
	{
		id: 'R17_CLIENT_PCF',
		source: '#17',
		description: 'Продуктовый PCF без сертификации',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'PRODUCT_INFO' },
			{ type: 'equals', questionId: 'Q3.3a', value: 'CERT_NOT_REQUIRED' },
		],
		outputs: { reports: ['PRODUCT_PCF'] },
	},
	{
		id: 'R18_CLIENT_SCOPE3',
		source: '#18',
		description: 'Scope 3 пакет для клиента',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'UPSTREAM' },
		],
		outputs: { reports: ['CLIENT_SCOPE3_PACKAGE'] },
	},
	{
		id: 'R19_CLIENT_TEMPLATE',
		source: '#19',
		description: 'Заполнение клиентского шаблона',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'TEMPLATE' },
		],
		outputs: { reports: ['CLIENT_TEMPLATE_FILL'] },
	},
	{
		id: 'R20_CLIENT_SCOPE3_DETAIL',
		source: '#20',
		description: 'Детальный Scope 3 по категориям',
		conditions: [
			{ type: 'hasAny', questionId: 'Q3.6' },
		],
		outputs: { reports: ['SCOPE3_DETAILED'] },
	},
	{
		id: 'R21_CLIENT_CARBON_NEUTRAL',
		source: '#21',
		description: 'Carbon Neutral / PAS 2060',
		conditions: [
			{ type: 'includes', questionId: 'Q3.1', value: 'CERTIFICATE' },
			{ type: 'equals', questionId: 'Q3.5', value: 'CARBON_NEUTRAL' },
		],
		outputs: { reports: ['CARBON_NEUTRAL_CERT'] },
	},

	// =============================
	// Банки и инвесторы (#22–#28)
	// =============================
	{
		id: 'R22_BANK_TCFD',
		source: '#22',
		description: 'TCFD отчёт по требованию банка',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includes', questionId: 'Q4.2', value: 'TCFD' },
		],
		outputs: { reports: ['TCFD_REPORT'] },
	},
	{
		id: 'R23_BANK_GHG_VERIFIED',
		source: '#23',
		description: 'Верифицированный GHG при требовании банка',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includes', questionId: 'Q4.2', value: 'GHG_VERIFIED' },
		],
		outputs: { reports: ['CORP_GHG_VERIFIED'] },
	},
	{
		id: 'R24_BANK_CDP',
		source: '#24',
		description: 'CDP от банка/инвестора',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includes', questionId: 'Q4.2', value: 'CDP' },
		],
		outputs: { reports: ['CDP_DISCLOSURE'] },
	},
	{
		id: 'R25_BANK_ISO',
		source: '#25',
		description: 'ISO 14064 по запросу банка',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includes', questionId: 'Q4.2', value: 'ISO_14064' },
		],
		outputs: { reports: ['ISO_14064_CERT'] },
	},
	{
		id: 'R26_BANK_TEMPLATE',
		source: '#26',
		description: 'Заполнение банковского шаблона',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includes', questionId: 'Q4.2', value: 'BANK_TEMPLATE' },
		],
		outputs: { reports: ['BANK_TEMPLATE_FILL'] },
	},
	{
		id: 'R27_BANK_DEFAULT_VERIFIED',
		source: '#27',
		description: 'Банк не указал формат — default верифицированный GHG',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'isEmpty', questionId: 'Q4.2' },
		],
		outputs: { reports: ['CORP_GHG_VERIFIED'] },
	},
	{
		id: 'R28_BANK_DATA_ONLY',
		source: '#28',
		description: 'Банку нужны только данные Scope 1-2-3',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'equals', questionId: 'Q4.1', value: 'BANK_INTERNAL_REPORT' },
		],
		outputs: { reports: ['SCOPE123_DATASET'] },
	},

	// =============================
	// Программы и рейтинги (#29–#34)
	// =============================
	{
		id: 'R29_PROGRAM_CDP',
		source: '#29',
		description: 'CDP в рамках программы',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'CDP' },
		],
		outputs: { reports: ['CDP_DISCLOSURE'] },
	},
	{
		id: 'R30_PROGRAM_SBTI',
		source: '#30',
		description: 'SBTi обязательства',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'SBTI' },
		],
		outputs: { reports: ['SBTI_COMMITMENT', 'CORP_GHG'] },
	},
	{
		id: 'R31_PROGRAM_RE100',
		source: '#31',
		description: 'RE100 отчётность',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'RE100' },
		],
		outputs: { reports: ['RE100_REPORTING'] },
	},
	{
		id: 'R32_PROGRAM_ECOVADIS',
		source: '#32',
		description: 'EcoVadis программа',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'ECOVADIS' },
		],
		outputs: { reports: ['ECOVADIS_SCORE'] },
	},
	{
		id: 'R33_PROGRAM_GRESB',
		source: '#33',
		description: 'GRESB / CRREM оценка',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'GRESB' },
		],
		outputs: { reports: ['GRESB_ASSESSMENT'] },
	},
	{
		id: 'R34_PROGRAM_BCORP',
		source: '#34',
		description: 'B Corp Impact Assessment',
		conditions: [
			{ type: 'includes', questionId: 'Q5.1', value: 'BCORP' },
		],
		outputs: { reports: ['BCORP_IMPACT_ASSESSMENT'] },
	},

	// =============================
	// Внутренние инициативы (#35–#53)
	// =============================
	{
		id: 'R35_INTERNAL_SIMPLE',
		source: '#35',
		description: 'Упрощённый GHG для первого расчёта без верификации',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'UNDERSTAND_FOOTPRINT' },
			{ type: 'equals', questionId: 'Q7.2', value: 'FIRST_TIME_NO_VERIF' },
		],
		outputs: { reports: ['CORP_GHG_SIMPLIFIED'] },
	},
	{
		id: 'R36_INTERNAL_FULL_VERIFIED',
		source: '#36',
		description: 'Полный GHG с верификацией при первом расчёте',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'UNDERSTAND_FOOTPRINT' },
			{ type: 'equals', questionId: 'Q7.2', value: 'FIRST_TIME_WITH_VERIF' },
		],
		outputs: { reports: ['CORP_GHG_VERIFIED'] },
	},
	{
		id: 'R37_INTERNAL_ANNUAL',
		source: '#37',
		description: 'Ежегодное обновление GHG',
		conditions: [
			{ type: 'equals', questionId: 'Q7.2', value: 'ALREADY_DONE' },
		],
		outputs: { reports: ['CORP_GHG_ANNUAL'] },
	},
	{
		id: 'R38_INTERNAL_PREP',
		source: '#38',
		description: 'Подготовительный GHG к будущим требованиям',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'PREPARE_FOR_REGULATION' },
			{ type: 'anyOf', questionId: 'Q7.3', values: ['CSRD', 'SEC_CLIMATE', 'SBTI', 'CLIENT_SPECIFIC', 'OTHER_FUTURE'] },
		],
		outputs: { reports: ['PREP_GHG'] },
	},
	{
		id: 'R39_INTERNAL_PUBLIC',
		source: '#39',
		description: 'Публичное раскрытие корпоративного GHG',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'SET_TARGETS' },
			{ type: 'equals', questionId: 'Q7.4', value: 'PUBLIC_TARGETS' },
		],
		outputs: { reports: ['CORP_GHG_PUBLIC'] },
	},
	{
		id: 'R40_INTERNAL_INTERNAL',
		source: '#40',
		description: 'Внутренние цели без публикации',
		conditions: [
			{ type: 'equals', questionId: 'Q7.4', value: 'INTERNAL_TARGETS' },
		],
		outputs: { reports: ['CORP_GHG_INTERNAL'] },
	},
	{
		id: 'R41_INTERNAL_SBTI',
		source: '#41',
		description: 'SBTi из блока внутренних целей',
		conditions: [
			{ type: 'equals', questionId: 'Q7.4', value: 'SBTI' },
		],
		outputs: { reports: ['SBTI_COMMITMENT', 'CORP_GHG'] },
	},
	{
		id: 'R42_INTERNAL_COMPANY_CERT',
		source: '#42',
		description: 'Сертификат для репутации компании',
		conditions: [
			{ type: 'includes', questionId: 'Q7.5', value: 'COMPANY_CERT' },
		],
		outputs: { reports: ['ISO_14064_CERT', 'CARBON_NEUTRAL_CERT'] },
	},
	{
		id: 'R43_INTERNAL_COMPANY_PUBLIC',
		source: '#43',
		description: 'Публикация корпоративного следа для репутации',
		conditions: [
			{ type: 'includes', questionId: 'Q7.5', value: 'COMPANY_PUBLICATION' },
		],
		outputs: { reports: ['CORP_GHG_PUBLIC'] },
	},
	{
		id: 'R44_INTERNAL_PRODUCT_CERT',
		source: '#44',
		description: 'Продуктовая сертификация для репутации',
		conditions: [
			{ type: 'includes', questionId: 'Q7.5', value: 'PRODUCT_CERT' },
		],
		outputs: { reports: ['EPD_OR_ISO_14067'] },
	},
	{
		id: 'R45_INTERNAL_PRODUCT_PCF',
		source: '#45',
		description: 'Публикация продуктового следа',
		conditions: [
			{ type: 'includes', questionId: 'Q7.5', value: 'PRODUCT_PUBLICATION' },
		],
		outputs: { reports: ['PRODUCT_PCF'] },
	},
	{
		id: 'R46_INTERNAL_TENDER_CORP',
		source: '#46',
		description: 'Корпоративный GHG для тендеров',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'TENDERS' },
			{ type: 'includes', questionId: 'Q7.6', value: 'CORPORATE_FOOTPRINT' },
		],
		outputs: { reports: ['CORP_GHG'] },
	},
	{
		id: 'R47_INTERNAL_TENDER_PCF',
		source: '#47',
		description: 'Продуктовый PCF для тендера',
		conditions: [
			{ type: 'includes', questionId: 'Q7.6', value: 'PRODUCT_PCF' },
		],
		outputs: { reports: ['PRODUCT_PCF'] },
	},
	{
		id: 'R48_INTERNAL_TENDER_ISO',
		source: '#48',
		description: 'ISO 14064 для тендера',
		conditions: [
			{ type: 'includes', questionId: 'Q7.6', value: 'ISO_14064' },
		],
		outputs: { reports: ['ISO_14064_CERT'] },
	},
	{
		id: 'R49_INTERNAL_TENDER_EPD',
		source: '#49',
		description: 'EPD для тендера',
		conditions: [
			{ type: 'includes', questionId: 'Q7.6', value: 'EPD' },
		],
		outputs: { reports: ['EPD_OR_ISO_14067'] },
	},
	{
		id: 'R50_INTERNAL_TENDER_PLAN',
		source: '#50',
		description: 'План сокращения выбросов для тендера',
		conditions: [
			{ type: 'includes', questionId: 'Q7.6', value: 'REDUCTION_PLAN' },
		],
		outputs: { reports: ['CLIMATE_ACTION_PLAN'] },
	},
	{
		id: 'R51_INTERNAL_TENDER_RECS',
		source: '#51',
		description: 'Стратегия ВИЭ для тендеров',
		conditions: [
			{ type: 'includes', questionId: 'Q7.6', value: 'RE_CERTIFICATES' },
		],
		outputs: { reports: ['RECS_OR_PPA_STRATEGY'] },
	},
	{
		id: 'R52_INTERNAL_ENERGY_AUDIT',
		source: '#52',
		description: 'Энергоаудит',
		conditions: [
			{ type: 'includes', questionId: 'Q7.1', value: 'ENERGY_EFFICIENCY' },
		],
		outputs: { reports: ['ENERGY_AUDIT_SCOPE12'] },
	},
	{
		id: 'R53_INTERNAL_ROUTING',
		source: '#53',
		description: 'Прочие внутренние инициаторы подключают правила 35–52',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'INTERNAL_OTHER' },
		],
		outputs: { notes: ['INTERNAL_FOLLOW_STANDARD_FLOW'] },
	},

	// =============================
	// Отраслевая специфика (#54–#60)
	// =============================
	{
		id: 'R54_SECTOR_CORSIA_DUP',
		source: '#54',
		description: 'Подтверждение CORSIA из отраслевого блока',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'AVIATION' },
			{ type: 'equals', questionId: 'Q11.1', value: 'INTERNATIONAL' },
		],
		outputs: { reports: ['CORSIA'] },
	},
	{
		id: 'R55_SECTOR_EU_MRV_DUP',
		source: '#55',
		description: 'Подтверждение EU MRV',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'MARITIME' },
			{ type: 'equals', questionId: 'Q11.2', value: 'EU_PORTS' },
		],
		outputs: { reports: ['EU_MRV'] },
	},
	{
		id: 'R56_SECTOR_SFDR_DUP',
		source: '#56',
		description: 'SFDR из отраслевого блока',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'FINANCE' },
			{ type: 'includes', questionId: 'Q11.3', value: 'FUNDS' },
		],
		outputs: { reports: ['SFDR'] },
	},
	{
		id: 'R57_SECTOR_BUILDING_CARBON',
		source: '#57',
		description: 'Углеродный след здания',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'CONSTRUCTION' },
			{ type: 'includesAny', questionId: 'Q11.4', values: ['LEED', 'BREEAM'] },
		],
		outputs: { reports: ['BUILDING_CARBON_FOOTPRINT'] },
	},
	{
		id: 'R58_SECTOR_GRESB_CRREM',
		source: '#58',
		description: 'GRESB/CRREM для портфелей недвижимости',
		conditions: [
			{ type: 'includesAny', questionId: 'Q11.4', values: ['GRESB', 'CRREM'] },
		],
		outputs: { reports: ['GRESB_ASSESSMENT'] },
	},
	{
		id: 'R59_SECTOR_IT_SCOPE2',
		source: '#59',
		description: 'Детальный Scope 2 для собственных ЦОД',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'IT' },
			{ type: 'includes', questionId: 'Q11.5', value: 'OWN_DATA_CENTERS' },
		],
		outputs: { reports: ['SCOPE2_DETAILED'] },
	},
	{
		id: 'R60_SECTOR_IT_SCOPE3',
		source: '#60',
		description: 'Scope 3 Категория 1 для облаков',
		conditions: [
			{ type: 'equals', questionId: 'Q0.2', value: 'IT' },
			{ type: 'includes', questionId: 'Q11.5', value: 'CLOUD_PROVIDERS' },
		],
		outputs: { reports: ['SCOPE3_CATEGORY1_SUPPLIERS'] },
	},

	// =============================
	// Комбинированные сценарии (#61–#64)
	// =============================
	{
		id: 'R61_COMBO_REG_CLIENT',
		source: '#61',
		description: 'Регулятор + клиент → регуляторные отчёты главные',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'REGULATOR' },
			{ type: 'includesAny', questionId: 'Q1.1', values: CLIENT_INITIATORS },
		],
		outputs: { notes: ['PRIORITIZE_REGULATOR_OVER_CLIENT'] },
	},
	{
		id: 'R62_COMBO_REG_INTERNAL',
		source: '#62',
		description: 'Регулятор + внутренняя инициатива',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'REGULATOR' },
			{ type: 'includesAny', questionId: 'Q1.1', values: INTERNAL_INITIATORS },
		],
		outputs: { notes: ['INTERNAL_REPORTS_MARK_OPTIONAL'] },
	},
	{
		id: 'R63_COMBO_CLIENT_BANK_INTERNAL',
		source: '#63',
		description: 'Клиент + банк + внутренние → объединить верифицированный GHG',
		conditions: [
			{ type: 'includesAny', questionId: 'Q1.1', values: CLIENT_INITIATORS },
			{ type: 'includes', questionId: 'Q1.1', value: 'BANK_INVESTOR' },
			{ type: 'includesAny', questionId: 'Q1.1', values: INTERNAL_INITIATORS },
		],
		outputs: { reports: ['CORP_GHG_VERIFIED'], notes: ['SHARED_DATASET_FOR_CLIENT_AND_BANK'] },
	},
	{
		id: 'R64_COMBO_PROGRAM_INTERNAL',
		source: '#64',
		description: 'Программа + внутренние KPI',
		conditions: [
			{ type: 'includes', questionId: 'Q1.1', value: 'PROGRAM' },
			{ type: 'includesAny', questionId: 'Q1.1', values: INTERNAL_INITIATORS },
		],
		outputs: { notes: ['PROGRAM_IS_BASELINE_INTERNAL_IS_EXTENSION'] },
	},

	// =============================
	// CBAM-специфика (#65–#68)
	// =============================
	{
		id: 'R65_CBAM_SUPPLIER_DATA',
		source: '#65',
		description: 'Экспортёр CBAM-товаров, передающий данные клиентам',
		conditions: [
			{ type: 'equals', questionId: 'Q9.1', value: 'YES' },
			{ type: 'includes', questionId: 'Q9.2', value: 'CBAM_GOODS' },
			{ type: 'equals', questionId: 'Q9.3', value: 'SUPPLIER_ONLY' },
		],
		outputs: { reports: ['CBAM_DATA_PACKAGE'] },
	},
	{
		id: 'R66_CBAM_IMPORTER',
		source: '#66',
		description: 'Импортёр CBAM с покупкой сертификатов',
		conditions: [
			{ type: 'equals', questionId: 'Q9.3', value: 'IMPORTER_OF_RECORD' },
		],
		outputs: { reports: ['CBAM_REPORT', 'CBAM_ALLOWANCES'], tags: ['REGULATORY_MANDATORY'] },
	},
	{
		id: 'R67_CBAM_MONITOR',
		source: '#67',
		description: 'Мониторинг CBAM для других товаров',
		conditions: [
			{ type: 'includes', questionId: 'Q9.2', value: 'NON_CBAM_GOODS' },
		],
		outputs: { reports: ['CBAM_MONITORING_ALERT'] },
	},
	{
		id: 'R68_CBAM_PREP',
		source: '#68',
		description: 'Подготовка к будущему экспорту CBAM-товаров',
		conditions: [
			{ type: 'equals', questionId: 'Q9.1', value: 'PLANNED' },
			{ type: 'includes', questionId: 'Q9.2', value: 'CBAM_GOODS' },
		],
		outputs: { reports: ['CBAM_PREP_METHOD'] },
	},
]
