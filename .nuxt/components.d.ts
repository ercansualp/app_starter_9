
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
      'ApiKeyEditor': typeof import("../components/ApiKeyEditor.vue")['default']
    'ConfirmationModal': typeof import("../components/ConfirmationModal.vue")['default']
    'CreateJobModal': typeof import("../components/CreateJobModal.vue")['default']
    'EditInstanceModal': typeof import("../components/EditInstanceModal.vue")['default']
    'Header': typeof import("../components/Header.vue")['default']
    'JobInstanceDetails': typeof import("../components/JobInstanceDetails.vue")['default']
    'KeyValueEditor': typeof import("../components/KeyValueEditor.vue")['default']
    'MessageTemplateModal': typeof import("../components/MessageTemplateModal.vue")['default']
    'Pagination': typeof import("../components/Pagination.vue")['default']
    'PermissionModal': typeof import("../components/PermissionModal.vue")['default']
    'RecentSales': typeof import("../components/RecentSales.vue")['default']
    'RoleModal': typeof import("../components/RoleModal.vue")['default']
    'RolePermissionsModal': typeof import("../components/RolePermissionsModal.vue")['default']
    'Sidebar': typeof import("../components/Sidebar.vue")['default']
    'StatCard': typeof import("../components/StatCard.vue")['default']
    'StatusBadge': typeof import("../components/StatusBadge.vue")['default']
    'ThemeSwitcher': typeof import("../components/ThemeSwitcher.vue")['default']
    'UserManagement': typeof import("../components/UserManagement.vue")['default']
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
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'Icon': typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
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
      'LazyApiKeyEditor': LazyComponent<typeof import("../components/ApiKeyEditor.vue")['default']>
    'LazyConfirmationModal': LazyComponent<typeof import("../components/ConfirmationModal.vue")['default']>
    'LazyCreateJobModal': LazyComponent<typeof import("../components/CreateJobModal.vue")['default']>
    'LazyEditInstanceModal': LazyComponent<typeof import("../components/EditInstanceModal.vue")['default']>
    'LazyHeader': LazyComponent<typeof import("../components/Header.vue")['default']>
    'LazyJobInstanceDetails': LazyComponent<typeof import("../components/JobInstanceDetails.vue")['default']>
    'LazyKeyValueEditor': LazyComponent<typeof import("../components/KeyValueEditor.vue")['default']>
    'LazyMessageTemplateModal': LazyComponent<typeof import("../components/MessageTemplateModal.vue")['default']>
    'LazyPagination': LazyComponent<typeof import("../components/Pagination.vue")['default']>
    'LazyPermissionModal': LazyComponent<typeof import("../components/PermissionModal.vue")['default']>
    'LazyRecentSales': LazyComponent<typeof import("../components/RecentSales.vue")['default']>
    'LazyRoleModal': LazyComponent<typeof import("../components/RoleModal.vue")['default']>
    'LazyRolePermissionsModal': LazyComponent<typeof import("../components/RolePermissionsModal.vue")['default']>
    'LazySidebar': LazyComponent<typeof import("../components/Sidebar.vue")['default']>
    'LazyStatCard': LazyComponent<typeof import("../components/StatCard.vue")['default']>
    'LazyStatusBadge': LazyComponent<typeof import("../components/StatusBadge.vue")['default']>
    'LazyThemeSwitcher': LazyComponent<typeof import("../components/ThemeSwitcher.vue")['default']>
    'LazyUserManagement': LazyComponent<typeof import("../components/UserManagement.vue")['default']>
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
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyIcon': LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
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
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const ApiKeyEditor: typeof import("../components/ApiKeyEditor.vue")['default']
export const ConfirmationModal: typeof import("../components/ConfirmationModal.vue")['default']
export const CreateJobModal: typeof import("../components/CreateJobModal.vue")['default']
export const EditInstanceModal: typeof import("../components/EditInstanceModal.vue")['default']
export const Header: typeof import("../components/Header.vue")['default']
export const JobInstanceDetails: typeof import("../components/JobInstanceDetails.vue")['default']
export const KeyValueEditor: typeof import("../components/KeyValueEditor.vue")['default']
export const MessageTemplateModal: typeof import("../components/MessageTemplateModal.vue")['default']
export const Pagination: typeof import("../components/Pagination.vue")['default']
export const PermissionModal: typeof import("../components/PermissionModal.vue")['default']
export const RecentSales: typeof import("../components/RecentSales.vue")['default']
export const RoleModal: typeof import("../components/RoleModal.vue")['default']
export const RolePermissionsModal: typeof import("../components/RolePermissionsModal.vue")['default']
export const Sidebar: typeof import("../components/Sidebar.vue")['default']
export const StatCard: typeof import("../components/StatCard.vue")['default']
export const StatusBadge: typeof import("../components/StatusBadge.vue")['default']
export const ThemeSwitcher: typeof import("../components/ThemeSwitcher.vue")['default']
export const UserManagement: typeof import("../components/UserManagement.vue")['default']
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
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
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
export const LazyApiKeyEditor: LazyComponent<typeof import("../components/ApiKeyEditor.vue")['default']>
export const LazyConfirmationModal: LazyComponent<typeof import("../components/ConfirmationModal.vue")['default']>
export const LazyCreateJobModal: LazyComponent<typeof import("../components/CreateJobModal.vue")['default']>
export const LazyEditInstanceModal: LazyComponent<typeof import("../components/EditInstanceModal.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/Header.vue")['default']>
export const LazyJobInstanceDetails: LazyComponent<typeof import("../components/JobInstanceDetails.vue")['default']>
export const LazyKeyValueEditor: LazyComponent<typeof import("../components/KeyValueEditor.vue")['default']>
export const LazyMessageTemplateModal: LazyComponent<typeof import("../components/MessageTemplateModal.vue")['default']>
export const LazyPagination: LazyComponent<typeof import("../components/Pagination.vue")['default']>
export const LazyPermissionModal: LazyComponent<typeof import("../components/PermissionModal.vue")['default']>
export const LazyRecentSales: LazyComponent<typeof import("../components/RecentSales.vue")['default']>
export const LazyRoleModal: LazyComponent<typeof import("../components/RoleModal.vue")['default']>
export const LazyRolePermissionsModal: LazyComponent<typeof import("../components/RolePermissionsModal.vue")['default']>
export const LazySidebar: LazyComponent<typeof import("../components/Sidebar.vue")['default']>
export const LazyStatCard: LazyComponent<typeof import("../components/StatCard.vue")['default']>
export const LazyStatusBadge: LazyComponent<typeof import("../components/StatusBadge.vue")['default']>
export const LazyThemeSwitcher: LazyComponent<typeof import("../components/ThemeSwitcher.vue")['default']>
export const LazyUserManagement: LazyComponent<typeof import("../components/UserManagement.vue")['default']>
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
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
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

export const componentNames: string[]
