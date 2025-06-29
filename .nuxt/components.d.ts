
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'Alert': typeof import("../components/Alert.vue")['default']
    'Button': typeof import("../components/Button.vue")['default']
    'Card': typeof import("../components/Card.vue")['default']
    'CardAppointment': typeof import("../components/CardAppointment.vue")['default']
    'CardConfirmation': typeof import("../components/CardConfirmation.vue")['default']
    'CardProduct': typeof import("../components/CardProduct.vue")['default']
    'CardToothChart': typeof import("../components/CardToothChart.vue")['default']
    'CardVisit': typeof import("../components/CardVisit.vue")['default']
    'DropdownLanguage': typeof import("../components/DropdownLanguage.vue")['default']
    'FormForgot': typeof import("../components/FormForgot.vue")['default']
    'FormSignIn': typeof import("../components/FormSignIn.vue")['default']
    'FormSignUp': typeof import("../components/FormSignUp.vue")['default']
    'InputModal': typeof import("../components/InputModal.vue")['default']
    'MobileWarningPage': typeof import("../components/MobileWarningPage.vue")['default']
    'Modal': typeof import("../components/Modal.vue")['default']
    'NavPill': typeof import("../components/NavPill.vue")['default']
    'Pagination': typeof import("../components/Pagination.vue")['default']
    'Search': typeof import("../components/Search.vue")['default']
    'Sidebar': typeof import("../components/Sidebar.vue")['default']
    'Tab': typeof import("../components/Tab.vue")['default']
    'Table': typeof import("../components/Table.vue")['default']
    'TableSort': typeof import("../components/TableSort.vue")['default']
    'AnalyticsCardExpense': typeof import("../components/analytics/CardExpense.vue")['default']
    'AnalyticsCardHistoryTransactions': typeof import("../components/analytics/CardHistoryTransactions.vue")['default']
    'AnalyticsCardIncome': typeof import("../components/analytics/CardIncome.vue")['default']
    'AnalyticsCardRecentOPD': typeof import("../components/analytics/CardRecentOPD.vue")['default']
    'AnalyticsCardSummary': typeof import("../components/analytics/CardSummary.vue")['default']
    'AnalyticsCardTreatmentType': typeof import("../components/analytics/CardTreatmentType.vue")['default']
    'CalendarCardAppointment': typeof import("../components/calendar/CardAppointment.vue")['default']
    'CalendarCardDoctorFilter': typeof import("../components/calendar/CardDoctorFilter.vue")['default']
    'CalendarCardUpcoming': typeof import("../components/calendar/CardUpcoming.vue")['default']
    'CalendarFormAppointment': typeof import("../components/calendar/FormAppointment.vue")['default']
    'CalendarFormDoctorAppointment': typeof import("../components/calendar/FormDoctorAppointment.vue")['default']
    'CalendarFormPatientDetail': typeof import("../components/calendar/FormPatientDetail.vue")['default']
    'CalendarModalAppointment': typeof import("../components/calendar/ModalAppointment.vue")['default']
    'CalendarSchedule': typeof import("../components/calendar/Schedule.vue")['default']
    'CalendarViewDay': typeof import("../components/calendar/ViewDay.vue")['default']
    'CalendarViewMonth': typeof import("../components/calendar/ViewMonth.vue")['default']
    'CalendarViewWeek': typeof import("../components/calendar/ViewWeek.vue")['default']
    'ChatCardChatBoard': typeof import("../components/chat/CardChatBoard.vue")['default']
    'ChatCardChatGroup': typeof import("../components/chat/CardChatGroup.vue")['default']
    'ChatCardChatProfile': typeof import("../components/chat/CardChatProfile.vue")['default']
    'ChatFileUploader': typeof import("../components/chat/FileUploader.vue")['default']
    'ChatFormAddNewPatient': typeof import("../components/chat/FormAddNewPatient.vue")['default']
    'CostCardDailyExpense': typeof import("../components/cost/CardDailyExpense.vue")['default']
    'CostCardDailyIncome': typeof import("../components/cost/CardDailyIncome.vue")['default']
    'CostCardEquipment': typeof import("../components/cost/CardEquipment.vue")['default']
    'CostTableCost': typeof import("../components/cost/TableCost.vue")['default']
    'DoctorCardDF': typeof import("../components/doctor/CardDF.vue")['default']
    'DoctorCardPatientList': typeof import("../components/doctor/CardPatientList.vue")['default']
    'DoctorCardProfile': typeof import("../components/doctor/CardProfile.vue")['default']
    'ManageActivitiesTableActivities': typeof import("../components/manage/activities/TableActivities.vue")['default']
    'ManageAdminFormAddAdmin': typeof import("../components/manage/admin/FormAddAdmin.vue")['default']
    'ManageAdminTableAdmin': typeof import("../components/manage/admin/TableAdmin.vue")['default']
    'ManageAssistantCardAssistant': typeof import("../components/manage/assistant/CardAssistant.vue")['default']
    'ManageAssistantFormAddAssistant': typeof import("../components/manage/assistant/FormAddAssistant.vue")['default']
    'ManageBranchCardBranch': typeof import("../components/manage/branch/CardBranch.vue")['default']
    'ManageBranchFormAddBranch': typeof import("../components/manage/branch/FormAddBranch.vue")['default']
    'ManageDoctorCardDoctor': typeof import("../components/manage/doctor/CardDoctor.vue")['default']
    'ManageDoctorFormAddDoctor': typeof import("../components/manage/doctor/FormAddDoctor.vue")['default']
    'ManageDrugFormAddNewDrug': typeof import("../components/manage/drug/FormAddNewDrug.vue")['default']
    'ManageDxtxCardDiagnosis': typeof import("../components/manage/dxtx/CardDiagnosis.vue")['default']
    'ManageDxtxCardTreatment': typeof import("../components/manage/dxtx/CardTreatment.vue")['default']
    'ManagePaymentCardPaymentType': typeof import("../components/manage/payment/CardPaymentType.vue")['default']
    'ManagePaymentTablePayment': typeof import("../components/manage/payment/TablePayment.vue")['default']
    'ManageStockCardProductExternal': typeof import("../components/manage/stock/CardProductExternal.vue")['default']
    'ManageStockCardProductInternal': typeof import("../components/manage/stock/CardProductInternal.vue")['default']
    'ManageStockFormAddStock': typeof import("../components/manage/stock/FormAddStock.vue")['default']
    'ManageStockFormAdjustStock': typeof import("../components/manage/stock/FormAdjustStock.vue")['default']
    'OpdCardPatientDetail': typeof import("../components/opd/CardPatientDetail.vue")['default']
    'OpdCardPayment': typeof import("../components/opd/CardPayment.vue")['default']
    'OpdCardPaymentAdd': typeof import("../components/opd/CardPaymentAdd.vue")['default']
    'OpdCardTreatmentDetail': typeof import("../components/opd/CardTreatmentDetail.vue")['default']
    'OpdCardTreatmentHistory': typeof import("../components/opd/CardTreatmentHistory.vue")['default']
    'OpdCardVistits': typeof import("../components/opd/CardVistits.vue")['default']
    'OpdModalTreatmentAdd': typeof import("../components/opd/ModalTreatmentAdd.vue")['default']
    'OpdModalVisitAdd': typeof import("../components/opd/ModalVisitAdd.vue")['default']
    'OpdTablePatientOPD': typeof import("../components/opd/TablePatientOPD.vue")['default']
    'RevenueCardProfit': typeof import("../components/revenue/CardProfit.vue")['default']
    'RevenueChartProfit': typeof import("../components/revenue/ChartProfit.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
    'NuxtPicture': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
    'Icon': typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
    'NuxtLinkLocale': typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
    'SwitchLocalePathLink': typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
    'NuxtEmojiPicker': typeof import("../node_modules/nuxt-emoji-picker/dist/runtime/components/NuxtEmojiPicker.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'NuxtEmojiPicker': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyAlert': LazyComponent<typeof import("../components/Alert.vue")['default']>
    'LazyButton': LazyComponent<typeof import("../components/Button.vue")['default']>
    'LazyCard': LazyComponent<typeof import("../components/Card.vue")['default']>
    'LazyCardAppointment': LazyComponent<typeof import("../components/CardAppointment.vue")['default']>
    'LazyCardConfirmation': LazyComponent<typeof import("../components/CardConfirmation.vue")['default']>
    'LazyCardProduct': LazyComponent<typeof import("../components/CardProduct.vue")['default']>
    'LazyCardToothChart': LazyComponent<typeof import("../components/CardToothChart.vue")['default']>
    'LazyCardVisit': LazyComponent<typeof import("../components/CardVisit.vue")['default']>
    'LazyDropdownLanguage': LazyComponent<typeof import("../components/DropdownLanguage.vue")['default']>
    'LazyFormForgot': LazyComponent<typeof import("../components/FormForgot.vue")['default']>
    'LazyFormSignIn': LazyComponent<typeof import("../components/FormSignIn.vue")['default']>
    'LazyFormSignUp': LazyComponent<typeof import("../components/FormSignUp.vue")['default']>
    'LazyInputModal': LazyComponent<typeof import("../components/InputModal.vue")['default']>
    'LazyMobileWarningPage': LazyComponent<typeof import("../components/MobileWarningPage.vue")['default']>
    'LazyModal': LazyComponent<typeof import("../components/Modal.vue")['default']>
    'LazyNavPill': LazyComponent<typeof import("../components/NavPill.vue")['default']>
    'LazyPagination': LazyComponent<typeof import("../components/Pagination.vue")['default']>
    'LazySearch': LazyComponent<typeof import("../components/Search.vue")['default']>
    'LazySidebar': LazyComponent<typeof import("../components/Sidebar.vue")['default']>
    'LazyTab': LazyComponent<typeof import("../components/Tab.vue")['default']>
    'LazyTable': LazyComponent<typeof import("../components/Table.vue")['default']>
    'LazyTableSort': LazyComponent<typeof import("../components/TableSort.vue")['default']>
    'LazyAnalyticsCardExpense': LazyComponent<typeof import("../components/analytics/CardExpense.vue")['default']>
    'LazyAnalyticsCardHistoryTransactions': LazyComponent<typeof import("../components/analytics/CardHistoryTransactions.vue")['default']>
    'LazyAnalyticsCardIncome': LazyComponent<typeof import("../components/analytics/CardIncome.vue")['default']>
    'LazyAnalyticsCardRecentOPD': LazyComponent<typeof import("../components/analytics/CardRecentOPD.vue")['default']>
    'LazyAnalyticsCardSummary': LazyComponent<typeof import("../components/analytics/CardSummary.vue")['default']>
    'LazyAnalyticsCardTreatmentType': LazyComponent<typeof import("../components/analytics/CardTreatmentType.vue")['default']>
    'LazyCalendarCardAppointment': LazyComponent<typeof import("../components/calendar/CardAppointment.vue")['default']>
    'LazyCalendarCardDoctorFilter': LazyComponent<typeof import("../components/calendar/CardDoctorFilter.vue")['default']>
    'LazyCalendarCardUpcoming': LazyComponent<typeof import("../components/calendar/CardUpcoming.vue")['default']>
    'LazyCalendarFormAppointment': LazyComponent<typeof import("../components/calendar/FormAppointment.vue")['default']>
    'LazyCalendarFormDoctorAppointment': LazyComponent<typeof import("../components/calendar/FormDoctorAppointment.vue")['default']>
    'LazyCalendarFormPatientDetail': LazyComponent<typeof import("../components/calendar/FormPatientDetail.vue")['default']>
    'LazyCalendarModalAppointment': LazyComponent<typeof import("../components/calendar/ModalAppointment.vue")['default']>
    'LazyCalendarSchedule': LazyComponent<typeof import("../components/calendar/Schedule.vue")['default']>
    'LazyCalendarViewDay': LazyComponent<typeof import("../components/calendar/ViewDay.vue")['default']>
    'LazyCalendarViewMonth': LazyComponent<typeof import("../components/calendar/ViewMonth.vue")['default']>
    'LazyCalendarViewWeek': LazyComponent<typeof import("../components/calendar/ViewWeek.vue")['default']>
    'LazyChatCardChatBoard': LazyComponent<typeof import("../components/chat/CardChatBoard.vue")['default']>
    'LazyChatCardChatGroup': LazyComponent<typeof import("../components/chat/CardChatGroup.vue")['default']>
    'LazyChatCardChatProfile': LazyComponent<typeof import("../components/chat/CardChatProfile.vue")['default']>
    'LazyChatFileUploader': LazyComponent<typeof import("../components/chat/FileUploader.vue")['default']>
    'LazyChatFormAddNewPatient': LazyComponent<typeof import("../components/chat/FormAddNewPatient.vue")['default']>
    'LazyCostCardDailyExpense': LazyComponent<typeof import("../components/cost/CardDailyExpense.vue")['default']>
    'LazyCostCardDailyIncome': LazyComponent<typeof import("../components/cost/CardDailyIncome.vue")['default']>
    'LazyCostCardEquipment': LazyComponent<typeof import("../components/cost/CardEquipment.vue")['default']>
    'LazyCostTableCost': LazyComponent<typeof import("../components/cost/TableCost.vue")['default']>
    'LazyDoctorCardDF': LazyComponent<typeof import("../components/doctor/CardDF.vue")['default']>
    'LazyDoctorCardPatientList': LazyComponent<typeof import("../components/doctor/CardPatientList.vue")['default']>
    'LazyDoctorCardProfile': LazyComponent<typeof import("../components/doctor/CardProfile.vue")['default']>
    'LazyManageActivitiesTableActivities': LazyComponent<typeof import("../components/manage/activities/TableActivities.vue")['default']>
    'LazyManageAdminFormAddAdmin': LazyComponent<typeof import("../components/manage/admin/FormAddAdmin.vue")['default']>
    'LazyManageAdminTableAdmin': LazyComponent<typeof import("../components/manage/admin/TableAdmin.vue")['default']>
    'LazyManageAssistantCardAssistant': LazyComponent<typeof import("../components/manage/assistant/CardAssistant.vue")['default']>
    'LazyManageAssistantFormAddAssistant': LazyComponent<typeof import("../components/manage/assistant/FormAddAssistant.vue")['default']>
    'LazyManageBranchCardBranch': LazyComponent<typeof import("../components/manage/branch/CardBranch.vue")['default']>
    'LazyManageBranchFormAddBranch': LazyComponent<typeof import("../components/manage/branch/FormAddBranch.vue")['default']>
    'LazyManageDoctorCardDoctor': LazyComponent<typeof import("../components/manage/doctor/CardDoctor.vue")['default']>
    'LazyManageDoctorFormAddDoctor': LazyComponent<typeof import("../components/manage/doctor/FormAddDoctor.vue")['default']>
    'LazyManageDrugFormAddNewDrug': LazyComponent<typeof import("../components/manage/drug/FormAddNewDrug.vue")['default']>
    'LazyManageDxtxCardDiagnosis': LazyComponent<typeof import("../components/manage/dxtx/CardDiagnosis.vue")['default']>
    'LazyManageDxtxCardTreatment': LazyComponent<typeof import("../components/manage/dxtx/CardTreatment.vue")['default']>
    'LazyManagePaymentCardPaymentType': LazyComponent<typeof import("../components/manage/payment/CardPaymentType.vue")['default']>
    'LazyManagePaymentTablePayment': LazyComponent<typeof import("../components/manage/payment/TablePayment.vue")['default']>
    'LazyManageStockCardProductExternal': LazyComponent<typeof import("../components/manage/stock/CardProductExternal.vue")['default']>
    'LazyManageStockCardProductInternal': LazyComponent<typeof import("../components/manage/stock/CardProductInternal.vue")['default']>
    'LazyManageStockFormAddStock': LazyComponent<typeof import("../components/manage/stock/FormAddStock.vue")['default']>
    'LazyManageStockFormAdjustStock': LazyComponent<typeof import("../components/manage/stock/FormAdjustStock.vue")['default']>
    'LazyOpdCardPatientDetail': LazyComponent<typeof import("../components/opd/CardPatientDetail.vue")['default']>
    'LazyOpdCardPayment': LazyComponent<typeof import("../components/opd/CardPayment.vue")['default']>
    'LazyOpdCardPaymentAdd': LazyComponent<typeof import("../components/opd/CardPaymentAdd.vue")['default']>
    'LazyOpdCardTreatmentDetail': LazyComponent<typeof import("../components/opd/CardTreatmentDetail.vue")['default']>
    'LazyOpdCardTreatmentHistory': LazyComponent<typeof import("../components/opd/CardTreatmentHistory.vue")['default']>
    'LazyOpdCardVistits': LazyComponent<typeof import("../components/opd/CardVistits.vue")['default']>
    'LazyOpdModalTreatmentAdd': LazyComponent<typeof import("../components/opd/ModalTreatmentAdd.vue")['default']>
    'LazyOpdModalVisitAdd': LazyComponent<typeof import("../components/opd/ModalVisitAdd.vue")['default']>
    'LazyOpdTablePatientOPD': LazyComponent<typeof import("../components/opd/TablePatientOPD.vue")['default']>
    'LazyRevenueCardProfit': LazyComponent<typeof import("../components/revenue/CardProfit.vue")['default']>
    'LazyRevenueChartProfit': LazyComponent<typeof import("../components/revenue/ChartProfit.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
    'LazyIcon': LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
    'LazyNuxtLinkLocale': LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
    'LazySwitchLocalePathLink': LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
    'LazyNuxtEmojiPicker': LazyComponent<typeof import("../node_modules/nuxt-emoji-picker/dist/runtime/components/NuxtEmojiPicker.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
    'LazyNuxtEmojiPicker': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const Alert: typeof import("../components/Alert.vue")['default']
export const Button: typeof import("../components/Button.vue")['default']
export const Card: typeof import("../components/Card.vue")['default']
export const CardAppointment: typeof import("../components/CardAppointment.vue")['default']
export const CardConfirmation: typeof import("../components/CardConfirmation.vue")['default']
export const CardProduct: typeof import("../components/CardProduct.vue")['default']
export const CardToothChart: typeof import("../components/CardToothChart.vue")['default']
export const CardVisit: typeof import("../components/CardVisit.vue")['default']
export const DropdownLanguage: typeof import("../components/DropdownLanguage.vue")['default']
export const FormForgot: typeof import("../components/FormForgot.vue")['default']
export const FormSignIn: typeof import("../components/FormSignIn.vue")['default']
export const FormSignUp: typeof import("../components/FormSignUp.vue")['default']
export const InputModal: typeof import("../components/InputModal.vue")['default']
export const MobileWarningPage: typeof import("../components/MobileWarningPage.vue")['default']
export const Modal: typeof import("../components/Modal.vue")['default']
export const NavPill: typeof import("../components/NavPill.vue")['default']
export const Pagination: typeof import("../components/Pagination.vue")['default']
export const Search: typeof import("../components/Search.vue")['default']
export const Sidebar: typeof import("../components/Sidebar.vue")['default']
export const Tab: typeof import("../components/Tab.vue")['default']
export const Table: typeof import("../components/Table.vue")['default']
export const TableSort: typeof import("../components/TableSort.vue")['default']
export const AnalyticsCardExpense: typeof import("../components/analytics/CardExpense.vue")['default']
export const AnalyticsCardHistoryTransactions: typeof import("../components/analytics/CardHistoryTransactions.vue")['default']
export const AnalyticsCardIncome: typeof import("../components/analytics/CardIncome.vue")['default']
export const AnalyticsCardRecentOPD: typeof import("../components/analytics/CardRecentOPD.vue")['default']
export const AnalyticsCardSummary: typeof import("../components/analytics/CardSummary.vue")['default']
export const AnalyticsCardTreatmentType: typeof import("../components/analytics/CardTreatmentType.vue")['default']
export const CalendarCardAppointment: typeof import("../components/calendar/CardAppointment.vue")['default']
export const CalendarCardDoctorFilter: typeof import("../components/calendar/CardDoctorFilter.vue")['default']
export const CalendarCardUpcoming: typeof import("../components/calendar/CardUpcoming.vue")['default']
export const CalendarFormAppointment: typeof import("../components/calendar/FormAppointment.vue")['default']
export const CalendarFormDoctorAppointment: typeof import("../components/calendar/FormDoctorAppointment.vue")['default']
export const CalendarFormPatientDetail: typeof import("../components/calendar/FormPatientDetail.vue")['default']
export const CalendarModalAppointment: typeof import("../components/calendar/ModalAppointment.vue")['default']
export const CalendarSchedule: typeof import("../components/calendar/Schedule.vue")['default']
export const CalendarViewDay: typeof import("../components/calendar/ViewDay.vue")['default']
export const CalendarViewMonth: typeof import("../components/calendar/ViewMonth.vue")['default']
export const CalendarViewWeek: typeof import("../components/calendar/ViewWeek.vue")['default']
export const ChatCardChatBoard: typeof import("../components/chat/CardChatBoard.vue")['default']
export const ChatCardChatGroup: typeof import("../components/chat/CardChatGroup.vue")['default']
export const ChatCardChatProfile: typeof import("../components/chat/CardChatProfile.vue")['default']
export const ChatFileUploader: typeof import("../components/chat/FileUploader.vue")['default']
export const ChatFormAddNewPatient: typeof import("../components/chat/FormAddNewPatient.vue")['default']
export const CostCardDailyExpense: typeof import("../components/cost/CardDailyExpense.vue")['default']
export const CostCardDailyIncome: typeof import("../components/cost/CardDailyIncome.vue")['default']
export const CostCardEquipment: typeof import("../components/cost/CardEquipment.vue")['default']
export const CostTableCost: typeof import("../components/cost/TableCost.vue")['default']
export const DoctorCardDF: typeof import("../components/doctor/CardDF.vue")['default']
export const DoctorCardPatientList: typeof import("../components/doctor/CardPatientList.vue")['default']
export const DoctorCardProfile: typeof import("../components/doctor/CardProfile.vue")['default']
export const ManageActivitiesTableActivities: typeof import("../components/manage/activities/TableActivities.vue")['default']
export const ManageAdminFormAddAdmin: typeof import("../components/manage/admin/FormAddAdmin.vue")['default']
export const ManageAdminTableAdmin: typeof import("../components/manage/admin/TableAdmin.vue")['default']
export const ManageAssistantCardAssistant: typeof import("../components/manage/assistant/CardAssistant.vue")['default']
export const ManageAssistantFormAddAssistant: typeof import("../components/manage/assistant/FormAddAssistant.vue")['default']
export const ManageBranchCardBranch: typeof import("../components/manage/branch/CardBranch.vue")['default']
export const ManageBranchFormAddBranch: typeof import("../components/manage/branch/FormAddBranch.vue")['default']
export const ManageDoctorCardDoctor: typeof import("../components/manage/doctor/CardDoctor.vue")['default']
export const ManageDoctorFormAddDoctor: typeof import("../components/manage/doctor/FormAddDoctor.vue")['default']
export const ManageDrugFormAddNewDrug: typeof import("../components/manage/drug/FormAddNewDrug.vue")['default']
export const ManageDxtxCardDiagnosis: typeof import("../components/manage/dxtx/CardDiagnosis.vue")['default']
export const ManageDxtxCardTreatment: typeof import("../components/manage/dxtx/CardTreatment.vue")['default']
export const ManagePaymentCardPaymentType: typeof import("../components/manage/payment/CardPaymentType.vue")['default']
export const ManagePaymentTablePayment: typeof import("../components/manage/payment/TablePayment.vue")['default']
export const ManageStockCardProductExternal: typeof import("../components/manage/stock/CardProductExternal.vue")['default']
export const ManageStockCardProductInternal: typeof import("../components/manage/stock/CardProductInternal.vue")['default']
export const ManageStockFormAddStock: typeof import("../components/manage/stock/FormAddStock.vue")['default']
export const ManageStockFormAdjustStock: typeof import("../components/manage/stock/FormAdjustStock.vue")['default']
export const OpdCardPatientDetail: typeof import("../components/opd/CardPatientDetail.vue")['default']
export const OpdCardPayment: typeof import("../components/opd/CardPayment.vue")['default']
export const OpdCardPaymentAdd: typeof import("../components/opd/CardPaymentAdd.vue")['default']
export const OpdCardTreatmentDetail: typeof import("../components/opd/CardTreatmentDetail.vue")['default']
export const OpdCardTreatmentHistory: typeof import("../components/opd/CardTreatmentHistory.vue")['default']
export const OpdCardVistits: typeof import("../components/opd/CardVistits.vue")['default']
export const OpdModalTreatmentAdd: typeof import("../components/opd/ModalTreatmentAdd.vue")['default']
export const OpdModalVisitAdd: typeof import("../components/opd/ModalVisitAdd.vue")['default']
export const OpdTablePatientOPD: typeof import("../components/opd/TablePatientOPD.vue")['default']
export const RevenueCardProfit: typeof import("../components/revenue/CardProfit.vue")['default']
export const RevenueChartProfit: typeof import("../components/revenue/ChartProfit.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
export const NuxtPicture: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const NuxtLinkLocale: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtEmojiPicker: typeof import("../node_modules/nuxt-emoji-picker/dist/runtime/components/NuxtEmojiPicker.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const NuxtEmojiPicker: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyAlert: LazyComponent<typeof import("../components/Alert.vue")['default']>
export const LazyButton: LazyComponent<typeof import("../components/Button.vue")['default']>
export const LazyCard: LazyComponent<typeof import("../components/Card.vue")['default']>
export const LazyCardAppointment: LazyComponent<typeof import("../components/CardAppointment.vue")['default']>
export const LazyCardConfirmation: LazyComponent<typeof import("../components/CardConfirmation.vue")['default']>
export const LazyCardProduct: LazyComponent<typeof import("../components/CardProduct.vue")['default']>
export const LazyCardToothChart: LazyComponent<typeof import("../components/CardToothChart.vue")['default']>
export const LazyCardVisit: LazyComponent<typeof import("../components/CardVisit.vue")['default']>
export const LazyDropdownLanguage: LazyComponent<typeof import("../components/DropdownLanguage.vue")['default']>
export const LazyFormForgot: LazyComponent<typeof import("../components/FormForgot.vue")['default']>
export const LazyFormSignIn: LazyComponent<typeof import("../components/FormSignIn.vue")['default']>
export const LazyFormSignUp: LazyComponent<typeof import("../components/FormSignUp.vue")['default']>
export const LazyInputModal: LazyComponent<typeof import("../components/InputModal.vue")['default']>
export const LazyMobileWarningPage: LazyComponent<typeof import("../components/MobileWarningPage.vue")['default']>
export const LazyModal: LazyComponent<typeof import("../components/Modal.vue")['default']>
export const LazyNavPill: LazyComponent<typeof import("../components/NavPill.vue")['default']>
export const LazyPagination: LazyComponent<typeof import("../components/Pagination.vue")['default']>
export const LazySearch: LazyComponent<typeof import("../components/Search.vue")['default']>
export const LazySidebar: LazyComponent<typeof import("../components/Sidebar.vue")['default']>
export const LazyTab: LazyComponent<typeof import("../components/Tab.vue")['default']>
export const LazyTable: LazyComponent<typeof import("../components/Table.vue")['default']>
export const LazyTableSort: LazyComponent<typeof import("../components/TableSort.vue")['default']>
export const LazyAnalyticsCardExpense: LazyComponent<typeof import("../components/analytics/CardExpense.vue")['default']>
export const LazyAnalyticsCardHistoryTransactions: LazyComponent<typeof import("../components/analytics/CardHistoryTransactions.vue")['default']>
export const LazyAnalyticsCardIncome: LazyComponent<typeof import("../components/analytics/CardIncome.vue")['default']>
export const LazyAnalyticsCardRecentOPD: LazyComponent<typeof import("../components/analytics/CardRecentOPD.vue")['default']>
export const LazyAnalyticsCardSummary: LazyComponent<typeof import("../components/analytics/CardSummary.vue")['default']>
export const LazyAnalyticsCardTreatmentType: LazyComponent<typeof import("../components/analytics/CardTreatmentType.vue")['default']>
export const LazyCalendarCardAppointment: LazyComponent<typeof import("../components/calendar/CardAppointment.vue")['default']>
export const LazyCalendarCardDoctorFilter: LazyComponent<typeof import("../components/calendar/CardDoctorFilter.vue")['default']>
export const LazyCalendarCardUpcoming: LazyComponent<typeof import("../components/calendar/CardUpcoming.vue")['default']>
export const LazyCalendarFormAppointment: LazyComponent<typeof import("../components/calendar/FormAppointment.vue")['default']>
export const LazyCalendarFormDoctorAppointment: LazyComponent<typeof import("../components/calendar/FormDoctorAppointment.vue")['default']>
export const LazyCalendarFormPatientDetail: LazyComponent<typeof import("../components/calendar/FormPatientDetail.vue")['default']>
export const LazyCalendarModalAppointment: LazyComponent<typeof import("../components/calendar/ModalAppointment.vue")['default']>
export const LazyCalendarSchedule: LazyComponent<typeof import("../components/calendar/Schedule.vue")['default']>
export const LazyCalendarViewDay: LazyComponent<typeof import("../components/calendar/ViewDay.vue")['default']>
export const LazyCalendarViewMonth: LazyComponent<typeof import("../components/calendar/ViewMonth.vue")['default']>
export const LazyCalendarViewWeek: LazyComponent<typeof import("../components/calendar/ViewWeek.vue")['default']>
export const LazyChatCardChatBoard: LazyComponent<typeof import("../components/chat/CardChatBoard.vue")['default']>
export const LazyChatCardChatGroup: LazyComponent<typeof import("../components/chat/CardChatGroup.vue")['default']>
export const LazyChatCardChatProfile: LazyComponent<typeof import("../components/chat/CardChatProfile.vue")['default']>
export const LazyChatFileUploader: LazyComponent<typeof import("../components/chat/FileUploader.vue")['default']>
export const LazyChatFormAddNewPatient: LazyComponent<typeof import("../components/chat/FormAddNewPatient.vue")['default']>
export const LazyCostCardDailyExpense: LazyComponent<typeof import("../components/cost/CardDailyExpense.vue")['default']>
export const LazyCostCardDailyIncome: LazyComponent<typeof import("../components/cost/CardDailyIncome.vue")['default']>
export const LazyCostCardEquipment: LazyComponent<typeof import("../components/cost/CardEquipment.vue")['default']>
export const LazyCostTableCost: LazyComponent<typeof import("../components/cost/TableCost.vue")['default']>
export const LazyDoctorCardDF: LazyComponent<typeof import("../components/doctor/CardDF.vue")['default']>
export const LazyDoctorCardPatientList: LazyComponent<typeof import("../components/doctor/CardPatientList.vue")['default']>
export const LazyDoctorCardProfile: LazyComponent<typeof import("../components/doctor/CardProfile.vue")['default']>
export const LazyManageActivitiesTableActivities: LazyComponent<typeof import("../components/manage/activities/TableActivities.vue")['default']>
export const LazyManageAdminFormAddAdmin: LazyComponent<typeof import("../components/manage/admin/FormAddAdmin.vue")['default']>
export const LazyManageAdminTableAdmin: LazyComponent<typeof import("../components/manage/admin/TableAdmin.vue")['default']>
export const LazyManageAssistantCardAssistant: LazyComponent<typeof import("../components/manage/assistant/CardAssistant.vue")['default']>
export const LazyManageAssistantFormAddAssistant: LazyComponent<typeof import("../components/manage/assistant/FormAddAssistant.vue")['default']>
export const LazyManageBranchCardBranch: LazyComponent<typeof import("../components/manage/branch/CardBranch.vue")['default']>
export const LazyManageBranchFormAddBranch: LazyComponent<typeof import("../components/manage/branch/FormAddBranch.vue")['default']>
export const LazyManageDoctorCardDoctor: LazyComponent<typeof import("../components/manage/doctor/CardDoctor.vue")['default']>
export const LazyManageDoctorFormAddDoctor: LazyComponent<typeof import("../components/manage/doctor/FormAddDoctor.vue")['default']>
export const LazyManageDrugFormAddNewDrug: LazyComponent<typeof import("../components/manage/drug/FormAddNewDrug.vue")['default']>
export const LazyManageDxtxCardDiagnosis: LazyComponent<typeof import("../components/manage/dxtx/CardDiagnosis.vue")['default']>
export const LazyManageDxtxCardTreatment: LazyComponent<typeof import("../components/manage/dxtx/CardTreatment.vue")['default']>
export const LazyManagePaymentCardPaymentType: LazyComponent<typeof import("../components/manage/payment/CardPaymentType.vue")['default']>
export const LazyManagePaymentTablePayment: LazyComponent<typeof import("../components/manage/payment/TablePayment.vue")['default']>
export const LazyManageStockCardProductExternal: LazyComponent<typeof import("../components/manage/stock/CardProductExternal.vue")['default']>
export const LazyManageStockCardProductInternal: LazyComponent<typeof import("../components/manage/stock/CardProductInternal.vue")['default']>
export const LazyManageStockFormAddStock: LazyComponent<typeof import("../components/manage/stock/FormAddStock.vue")['default']>
export const LazyManageStockFormAdjustStock: LazyComponent<typeof import("../components/manage/stock/FormAdjustStock.vue")['default']>
export const LazyOpdCardPatientDetail: LazyComponent<typeof import("../components/opd/CardPatientDetail.vue")['default']>
export const LazyOpdCardPayment: LazyComponent<typeof import("../components/opd/CardPayment.vue")['default']>
export const LazyOpdCardPaymentAdd: LazyComponent<typeof import("../components/opd/CardPaymentAdd.vue")['default']>
export const LazyOpdCardTreatmentDetail: LazyComponent<typeof import("../components/opd/CardTreatmentDetail.vue")['default']>
export const LazyOpdCardTreatmentHistory: LazyComponent<typeof import("../components/opd/CardTreatmentHistory.vue")['default']>
export const LazyOpdCardVistits: LazyComponent<typeof import("../components/opd/CardVistits.vue")['default']>
export const LazyOpdModalTreatmentAdd: LazyComponent<typeof import("../components/opd/ModalTreatmentAdd.vue")['default']>
export const LazyOpdModalVisitAdd: LazyComponent<typeof import("../components/opd/ModalVisitAdd.vue")['default']>
export const LazyOpdTablePatientOPD: LazyComponent<typeof import("../components/opd/TablePatientOPD.vue")['default']>
export const LazyRevenueCardProfit: LazyComponent<typeof import("../components/revenue/CardProfit.vue")['default']>
export const LazyRevenueChartProfit: LazyComponent<typeof import("../components/revenue/ChartProfit.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtEmojiPicker: LazyComponent<typeof import("../node_modules/nuxt-emoji-picker/dist/runtime/components/NuxtEmojiPicker.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
export const LazyNuxtEmojiPicker: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
