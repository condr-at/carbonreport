(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
;
function Toaster(param) {
    let { position = 'top-right', richColors = true, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        position: position,
        richColors: richColors,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sonner.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data-client/queryClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createQueryClient",
    ()=>createQueryClient,
    "queryClientOptions",
    ()=>queryClientOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
;
const queryClientOptions = {
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60 * 1_000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1
        },
        mutations: {
            retry: 0
        }
    }
};
function createQueryClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"](queryClientOptions);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "request",
    ()=>request
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class ApiError extends Error {
    constructor(message, status, code, details){
        super(message), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "status", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "code", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "details", void 0);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
async function request(input, init) {
    var _response_headers_get;
    var _init_headers;
    const response = await fetch(input, {
        cache: 'no-store',
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(_init_headers = init === null || init === void 0 ? void 0 : init.headers) !== null && _init_headers !== void 0 ? _init_headers : {}
        }
    });
    const isJson = (_response_headers_get = response.headers.get('content-type')) === null || _response_headers_get === void 0 ? void 0 : _response_headers_get.includes('application/json');
    const payload = isJson ? await response.json().catch(()=>null) : null;
    if (!response.ok) {
        const message = typeof (payload === null || payload === void 0 ? void 0 : payload.error) === 'string' ? payload.error : response.statusText;
        var _payload_details;
        throw new ApiError(message || 'Request failed', response.status, payload === null || payload === void 0 ? void 0 : payload.code, (_payload_details = payload === null || payload === void 0 ? void 0 : payload.details) !== null && _payload_details !== void 0 ? _payload_details : payload);
    }
    if (!isJson) {
        // @ts-expect-error allow returning void for 204
        return undefined;
    }
    return payload;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data-client/keys.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contactsKeys",
    ()=>contactsKeys,
    "dataRequestKeys",
    ()=>dataRequestKeys,
    "featureKeys",
    ()=>featureKeys,
    "globalRequestsKeys",
    ()=>globalRequestsKeys,
    "organizationKeys",
    ()=>organizationKeys,
    "projectKeys",
    ()=>projectKeys,
    "userKeys",
    ()=>userKeys
]);
const projectKeys = {
    all: [
        'projects'
    ],
    list: function() {
        let organizationId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : undefined;
        return [
            'projects',
            'list',
            organizationId !== null && organizationId !== void 0 ? organizationId : 'all'
        ];
    },
    detail: (projectId)=>[
            'projects',
            projectId
        ],
    dataset: (projectId)=>[
            'projects',
            projectId,
            'dataset'
        ],
    contacts: (projectId)=>[
            'projects',
            projectId,
            'contacts'
        ]
};
const dataRequestKeys = {
    list: function(projectId) {
        let status = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'all';
        return [
            'projects',
            projectId,
            'data-requests',
            status
        ];
    },
    summary: (projectId)=>[
            'projects',
            projectId,
            'data-requests',
            'summary'
        ]
};
const contactsKeys = {
    list: ()=>[
            'contacts',
            'list'
        ],
    detail: (contactId)=>[
            'contacts',
            contactId
        ]
};
const globalRequestsKeys = {
    base: [
        'global-data-requests'
    ],
    list: (filters)=>{
        var _filters_projectId, _filters_status, _filters_contactId, _filters_deadline;
        return [
            'global-data-requests',
            (_filters_projectId = filters.projectId) !== null && _filters_projectId !== void 0 ? _filters_projectId : 'all',
            (_filters_status = filters.status) !== null && _filters_status !== void 0 ? _filters_status : 'all',
            (_filters_contactId = filters.contactId) !== null && _filters_contactId !== void 0 ? _filters_contactId : 'all',
            (_filters_deadline = filters.deadline) !== null && _filters_deadline !== void 0 ? _filters_deadline : 'all'
        ];
    }
};
const featureKeys = {
    flags: [
        'features'
    ]
};
const organizationKeys = {
    list: function() {
        let includePending = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        return [
            'organizations',
            includePending ? 'with-pending' : 'accepted'
        ];
    },
    current: (organizationId)=>[
            'organizations',
            'current',
            organizationId !== null && organizationId !== void 0 ? organizationId : 'default'
        ],
    usage: (organizationId)=>[
            'organizations',
            organizationId,
            'usage'
        ],
    members: (organizationId)=>[
            'organizations',
            organizationId,
            'members'
        ],
    planUpgrade: (organizationId)=>[
            'organizations',
            organizationId,
            'plan-upgrade'
        ]
};
const userKeys = {
    settings: ()=>[
            'user',
            'settings'
        ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notifications",
    ()=>notifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
'use client';
;
function resolveMessage(message, value) {
    return typeof message === 'function' ? message(value) : message;
}
const notifications = {
    success (message, options) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(message, options);
    },
    error (message, options) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message, options);
    },
    info (message, options) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(message, options);
    },
    action (message, action, options) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"])(message, {
            ...options,
            action
        });
    },
    async promise (promise, messages, options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].promise(promise, {
            loading: messages.loading,
            success: (data)=>resolveMessage(messages.success, data),
            error: (error)=>resolveMessage(messages.error, error),
            ...options
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data-client/organizations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateOrganization",
    ()=>useCreateOrganization,
    "useCurrentOrganization",
    ()=>useCurrentOrganization,
    "useDeleteOrganization",
    ()=>useDeleteOrganization,
    "useInviteOrganizationMember",
    ()=>useInviteOrganizationMember,
    "useOrganizationMembers",
    ()=>useOrganizationMembers,
    "useOrganizationUsage",
    ()=>useOrganizationUsage,
    "useOrganizations",
    ()=>useOrganizations,
    "usePlanUpgradeRequest",
    ()=>usePlanUpgradeRequest,
    "useRemoveMembership",
    ()=>useRemoveMembership,
    "useUpdateMembershipRole",
    ()=>useUpdateMembershipRole,
    "useUpdateOrganizationProfile",
    ()=>useUpdateOrganizationProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data-client/keys.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/notifications.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
async function fetchOrganizations() {
    let includePending = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    const query = includePending ? '?includePending=true' : '';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations".concat(query));
}
async function fetchCurrentOrganization(activeOrganizationId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/current", {
        headers: activeOrganizationId ? {
            'x-active-organization-id': activeOrganizationId
        } : undefined
    });
}
function useOrganizations() {
    let includePending = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list(includePending),
        queryFn: {
            "useOrganizations.useQuery": ()=>fetchOrganizations(includePending)
        }["useOrganizations.useQuery"]
    });
}
_s(useOrganizations, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCurrentOrganization(activeOrganizationId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].current(activeOrganizationId),
        queryFn: {
            "useCurrentOrganization.useQuery": ()=>fetchCurrentOrganization(activeOrganizationId)
        }["useCurrentOrganization.useQuery"],
        enabled: Boolean(activeOrganizationId) || activeOrganizationId === undefined
    });
}
_s1(useCurrentOrganization, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateOrganization() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organizations',
            'create'
        ],
        mutationFn: {
            "useCreateOrganization.useMutation": async (payload)=>{
                const body = {
                    display_name: payload.display_name
                };
                if (payload.description !== undefined) {
                    body.description = payload.description;
                }
                if (payload.logo_asset_id !== undefined) {
                    body.logo_asset_id = payload.logo_asset_id;
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])('/api/organizations', {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
            }
        }["useCreateOrganization.useMutation"],
        onSuccess: {
            "useCreateOrganization.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list(false)
                });
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list(true)
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Organization created.');
            }
        }["useCreateOrganization.useMutation"],
        onError: {
            "useCreateOrganization.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to create organization.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useCreateOrganization.useMutation"]
    });
}
_s2(useCreateOrganization, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateOrganizationProfile(organizationId) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organization',
            organizationId,
            'profile'
        ],
        mutationFn: {
            "useUpdateOrganizationProfile.useMutation": async (payload)=>{
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId), {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
            }
        }["useUpdateOrganizationProfile.useMutation"],
        onSuccess: {
            "useUpdateOrganizationProfile.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list()
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Organization profile updated.');
            }
        }["useUpdateOrganizationProfile.useMutation"],
        onError: {
            "useUpdateOrganizationProfile.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to update organization.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useUpdateOrganizationProfile.useMutation"]
    });
}
_s3(useUpdateOrganizationProfile, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
async function fetchOrganizationMembers(organizationId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId, "/members"));
    return response.members;
}
function useOrganizationMembers(organizationId) {
    _s4();
    const queryKey = organizationId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].members(organizationId) : [
        'organizations',
        'unknown',
        'members'
    ];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey,
        queryFn: {
            "useOrganizationMembers.useQuery": ()=>fetchOrganizationMembers(organizationId)
        }["useOrganizationMembers.useQuery"],
        enabled: Boolean(organizationId)
    });
}
_s4(useOrganizationMembers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useInviteOrganizationMember(organizationId) {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organization',
            organizationId,
            'invite'
        ],
        mutationFn: {
            "useInviteOrganizationMember.useMutation": async (payload)=>{
                var _payload_message;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId, "/invite"), {
                    method: 'POST',
                    body: JSON.stringify({
                        email: payload.email,
                        role: payload.role,
                        message: (_payload_message = payload.message) !== null && _payload_message !== void 0 ? _payload_message : undefined
                    })
                });
            }
        }["useInviteOrganizationMember.useMutation"],
        onSuccess: {
            "useInviteOrganizationMember.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].members(organizationId)
                });
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list()
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Invite sent.');
            }
        }["useInviteOrganizationMember.useMutation"],
        onError: {
            "useInviteOrganizationMember.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to send invite.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useInviteOrganizationMember.useMutation"]
    });
}
_s5(useInviteOrganizationMember, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMembershipRole(organizationId) {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organization',
            organizationId,
            'membership-role'
        ],
        mutationFn: {
            "useUpdateMembershipRole.useMutation": async (payload)=>{
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId, "/members/").concat(payload.membershipId), {
                    method: 'PATCH',
                    body: JSON.stringify({
                        role: payload.role
                    })
                });
            }
        }["useUpdateMembershipRole.useMutation"],
        onSuccess: {
            "useUpdateMembershipRole.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].members(organizationId)
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Role updated.');
            }
        }["useUpdateMembershipRole.useMutation"],
        onError: {
            "useUpdateMembershipRole.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to update role.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useUpdateMembershipRole.useMutation"]
    });
}
_s6(useUpdateMembershipRole, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useRemoveMembership(organizationId) {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organization',
            organizationId,
            'membership-remove'
        ],
        mutationFn: {
            "useRemoveMembership.useMutation": async (payload)=>{
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId, "/members/").concat(payload.membershipId), {
                    method: 'DELETE'
                });
            }
        }["useRemoveMembership.useMutation"],
        onSuccess: {
            "useRemoveMembership.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].members(organizationId)
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Member removed.');
            }
        }["useRemoveMembership.useMutation"],
        onError: {
            "useRemoveMembership.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to remove member.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useRemoveMembership.useMutation"]
    });
}
_s7(useRemoveMembership, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
async function fetchOrganizationUsage(organizationId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId, "/usage"));
}
function useOrganizationUsage(organizationId) {
    _s8();
    const queryKey = organizationId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].usage(organizationId) : [
        'organizations',
        'unknown',
        'usage'
    ];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey,
        queryFn: {
            "useOrganizationUsage.useQuery": ()=>fetchOrganizationUsage(organizationId)
        }["useOrganizationUsage.useQuery"],
        enabled: Boolean(organizationId),
        staleTime: 60_000
    });
}
_s8(useOrganizationUsage, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePlanUpgradeRequest(organizationId) {
    _s9();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].planUpgrade(organizationId),
        mutationFn: {
            "usePlanUpgradeRequest.useMutation": async (payload)=>{
                const response = await fetch("/api/organizations/".concat(organizationId, "/plan/upgrade"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                const body = await response.json().catch({
                    "usePlanUpgradeRequest.useMutation": ()=>null
                }["usePlanUpgradeRequest.useMutation"]);
                if (response.status === 501 && (body === null || body === void 0 ? void 0 : body.ticket_reference)) {
                    var _body_status, _body_message;
                    return {
                        ticket_reference: body.ticket_reference,
                        status: (_body_status = body.status) !== null && _body_status !== void 0 ? _body_status : 'not_implemented',
                        message: (_body_message = body.message) !== null && _body_message !== void 0 ? _body_message : 'Upgrade handled manually during beta.'
                    };
                }
                if (!response.ok) {
                    var _body_error, _body_details;
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]((_body_error = body === null || body === void 0 ? void 0 : body.error) !== null && _body_error !== void 0 ? _body_error : 'Failed to submit upgrade request', response.status, body === null || body === void 0 ? void 0 : body.code, (_body_details = body === null || body === void 0 ? void 0 : body.details) !== null && _body_details !== void 0 ? _body_details : body);
                }
                var _body_ticket_reference, _body_status1, _body_message1;
                return {
                    ticket_reference: (_body_ticket_reference = body === null || body === void 0 ? void 0 : body.ticket_reference) !== null && _body_ticket_reference !== void 0 ? _body_ticket_reference : null,
                    status: (_body_status1 = body === null || body === void 0 ? void 0 : body.status) !== null && _body_status1 !== void 0 ? _body_status1 : 'ok',
                    message: (_body_message1 = body === null || body === void 0 ? void 0 : body.message) !== null && _body_message1 !== void 0 ? _body_message1 : 'Upgrade request submitted.'
                };
            }
        }["usePlanUpgradeRequest.useMutation"],
        onSuccess: {
            "usePlanUpgradeRequest.useMutation": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success("Upgrade request logged".concat(data.ticket_reference ? " (#".concat(data.ticket_reference, ")") : '', "."));
            }
        }["usePlanUpgradeRequest.useMutation"],
        onError: {
            "usePlanUpgradeRequest.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to request plan upgrade.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["usePlanUpgradeRequest.useMutation"]
    });
}
_s9(usePlanUpgradeRequest, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteOrganization(organizationId, options) {
    _s10();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'organization',
            organizationId,
            'delete'
        ],
        mutationFn: {
            "useDeleteOrganization.useMutation": async ()=>{
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/api/organizations/".concat(organizationId), {
                    method: 'DELETE'
                });
            }
        }["useDeleteOrganization.useMutation"],
        onSuccess: {
            "useDeleteOrganization.useMutation": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["organizationKeys"].list(true)
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'organizations',
                        'current'
                    ],
                    exact: false
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Organization scheduled for deletion.');
                if (data === null || data === void 0 ? void 0 : data.retention_expires_at) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].info("Retention window ends ".concat(new Date(data.retention_expires_at).toLocaleDateString(), "."));
                }
            }
        }["useDeleteOrganization.useMutation"],
        onError: {
            "useDeleteOrganization.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to delete organization.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useDeleteOrganization.useMutation"],
        onSettled: {
            "useDeleteOrganization.useMutation": ()=>{
                var _options_onSettled;
                options === null || options === void 0 ? void 0 : (_options_onSettled = options.onSettled) === null || _options_onSettled === void 0 ? void 0 : _options_onSettled.call(options);
            }
        }["useDeleteOrganization.useMutation"]
    });
}
_s10(useDeleteOrganization, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/organizations/context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrganizationProvider",
    ()=>OrganizationProvider,
    "useOrganizationContext",
    ()=>useOrganizationContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$organizations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data-client/organizations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const LOCAL_STORAGE_KEY = 'carbonreport.activeOrganizationId';
const OrganizationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function getStoredOrganizationId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.localStorage.getItem(LOCAL_STORAGE_KEY);
}
function storeOrganizationId(organizationId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, organizationId);
}
function clearStoredOrganizationId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
}
function OrganizationProvider(param) {
    let { children } = param;
    _s();
    const { data, isLoading, isError, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$organizations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrganizations"])(true);
    const organizations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrganizationProvider.useMemo[organizations]": ()=>{
            var _data_organizations;
            return (_data_organizations = data === null || data === void 0 ? void 0 : data.organizations) !== null && _data_organizations !== void 0 ? _data_organizations : [];
        }
    }["OrganizationProvider.useMemo[organizations]"], [
        data
    ]);
    const acceptedOrganizations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrganizationProvider.useMemo[acceptedOrganizations]": ()=>organizations.filter({
                "OrganizationProvider.useMemo[acceptedOrganizations]": (org)=>!org.invite_status || org.invite_status === 'accepted'
            }["OrganizationProvider.useMemo[acceptedOrganizations]"])
    }["OrganizationProvider.useMemo[acceptedOrganizations]"], [
        organizations
    ]);
    const pendingInvites = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrganizationProvider.useMemo[pendingInvites]": ()=>organizations.filter({
                "OrganizationProvider.useMemo[pendingInvites]": (org)=>org.invite_status && org.invite_status !== 'accepted'
            }["OrganizationProvider.useMemo[pendingInvites]"])
    }["OrganizationProvider.useMemo[pendingInvites]"], [
        organizations
    ]);
    const [activeOrganizationId, setActiveOrganizationIdState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "OrganizationProvider.useState": ()=>getStoredOrganizationId()
    }["OrganizationProvider.useState"]);
    const [isBootstrapping, setIsBootstrapping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isUnauthorized, setIsUnauthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationProvider.useEffect": ()=>{
            if (isLoading) {
                return;
            }
            const unauthorized = isError && error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] && error.status === 401;
            setIsUnauthorized(unauthorized);
            if (unauthorized && activeOrganizationId !== null) {
                setActiveOrganizationIdState(null);
                clearStoredOrganizationId();
            }
        }
    }["OrganizationProvider.useEffect"], [
        activeOrganizationId,
        error,
        isError,
        isLoading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationProvider.useEffect": ()=>{
            if (isLoading) {
                return;
            }
            if (isUnauthorized) {
                setIsBootstrapping(false);
                return;
            }
            if (!acceptedOrganizations.length) {
                if (activeOrganizationId !== null) {
                    setActiveOrganizationIdState(null);
                    clearStoredOrganizationId();
                }
                setIsBootstrapping(false);
                return;
            }
            const stored = getStoredOrganizationId();
            if (stored && acceptedOrganizations.some({
                "OrganizationProvider.useEffect": (org)=>org.id === stored
            }["OrganizationProvider.useEffect"])) {
                if (stored !== activeOrganizationId) {
                    setActiveOrganizationIdState(stored);
                }
                setIsBootstrapping(false);
                return;
            }
            const firstAccepted = acceptedOrganizations[0];
            if (firstAccepted && firstAccepted.id !== activeOrganizationId) {
                setActiveOrganizationIdState(firstAccepted.id);
                storeOrganizationId(firstAccepted.id);
            }
            setIsBootstrapping(false);
        }
    }["OrganizationProvider.useEffect"], [
        acceptedOrganizations,
        activeOrganizationId,
        isLoading,
        isUnauthorized
    ]);
    const setActiveOrganizationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrganizationProvider.useCallback[setActiveOrganizationId]": (organizationId)=>{
            setActiveOrganizationIdState(organizationId);
            storeOrganizationId(organizationId);
        }
    }["OrganizationProvider.useCallback[setActiveOrganizationId]"], []);
    const { data: currentOrganizationResponse } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$organizations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentOrganization"])(activeOrganizationId !== null && activeOrganizationId !== void 0 ? activeOrganizationId : undefined);
    var _currentOrganizationResponse_organization;
    const currentOrganization = (_currentOrganizationResponse_organization = currentOrganizationResponse === null || currentOrganizationResponse === void 0 ? void 0 : currentOrganizationResponse.organization) !== null && _currentOrganizationResponse_organization !== void 0 ? _currentOrganizationResponse_organization : null;
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OrganizationProvider.useMemo[value]": ()=>({
                activeOrganizationId,
                setActiveOrganizationId,
                organizations,
                pendingInvites,
                acceptedOrganizations,
                isLoading,
                isError,
                error,
                currentOrganization,
                refetch,
                isBootstrapping,
                isUnauthorized
            })
    }["OrganizationProvider.useMemo[value]"], [
        activeOrganizationId,
        setActiveOrganizationId,
        organizations,
        pendingInvites,
        acceptedOrganizations,
        isLoading,
        isError,
        error,
        currentOrganization,
        refetch,
        isBootstrapping,
        isUnauthorized
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrganizationContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/organizations/context.tsx",
        lineNumber: 155,
        columnNumber: 10
    }, this);
}
_s(OrganizationProvider, "opew9j4rghBBpsstSRsgqLuW4rU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$organizations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrganizations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$organizations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentOrganization"]
    ];
});
_c = OrganizationProvider;
function useOrganizationContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OrganizationContext);
    if (!context) {
        throw new Error('useOrganizationContext must be used within an OrganizationProvider');
    }
    return context;
}
_s1(useOrganizationContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OrganizationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data-client/queryClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$organizations$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/organizations/context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const PUBLIC_ROUTES = new Set([
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email'
]);
function isPublicRoute(pathname) {
    if (!pathname) {
        return true;
    }
    if (PUBLIC_ROUTES.has(pathname)) {
        return true;
    }
    for (const route of PUBLIC_ROUTES){
        if (route !== '/' && pathname.startsWith("".concat(route, "/"))) {
            return true;
        }
    }
    return false;
}
function Providers(param) {
    let { children } = param;
    _s();
    const [client] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createQueryClient"])()
    }["Providers.useState"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Providers.useMemo[content]": ()=>{
            if (isPublicRoute(pathname)) {
                return children;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$organizations$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrganizationProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 52,
                columnNumber: 12
            }, this);
        }
    }["Providers.useMemo[content]"], [
        children,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: client,
            children: [
                content,
                ("TURBOPACK compile-time truthy", 1) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                    initialIsOpen: false
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 59,
                    columnNumber: 51
                }, this) : "TURBOPACK unreachable"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(Providers, "WbIMBblOPacmmSpeT4GzVznRiE4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_9c27a524._.js.map