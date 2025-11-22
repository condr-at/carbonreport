(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Avatar(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "avatar",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex size-8 shrink-0 overflow-hidden rounded-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Avatar;
function AvatarImage(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
        "data-slot": "avatar-image",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square size-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c1 = AvatarImage;
function AvatarFallback(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fallback"], {
        "data-slot": "avatar-fallback",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-muted flex size-full items-center justify-center rounded-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c2 = AvatarFallback;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Avatar");
__turbopack_context__.k.register(_c1, "AvatarImage");
__turbopack_context__.k.register(_c2, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(param) {
    let { className, variant, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "ButtonArrow",
    ()=>ButtonArrow,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap text-sm font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0', {
    variants: {
        variant: {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90',
            mono: 'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black hover:bg-zinc-950/90 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90',
            outline: 'bg-background text-accent-foreground border border-input hover:bg-accent data-[state=open]:bg-accent',
            dashed: 'text-accent-foreground border border-input border-dashed bg-background hover:bg-accent hover:text-accent-foreground data-[state=open]:text-accent-foreground',
            ghost: 'text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
            dim: 'text-muted-foreground hover:text-foreground data-[state=open]:text-foreground',
            foreground: '',
            inverse: ''
        },
        appearance: {
            default: '',
            ghost: ''
        },
        underline: {
            solid: '',
            dashed: ''
        },
        underlined: {
            solid: '',
            dashed: ''
        },
        size: {
            lg: 'h-10 px-4 text-sm gap-1.5 [&_svg:not([class*=size-])]:size-4',
            md: 'h-9 px-3 gap-1.5 text-sm [&_svg:not([class*=size-])]:size-4',
            sm: 'h-8 px-2.5 gap-1.25 text-xs [&_svg:not([class*=size-])]:size-3.5',
            xs: 'h-7 px-2 gap-1 text-xs [&_svg:not([class*=size-])]:size-3.5',
            icon: 'size-9 [&_svg:not([class*=size-])]:size-4 shrink-0'
        },
        autoHeight: {
            true: '',
            false: ''
        },
        radius: {
            md: 'rounded-md',
            full: 'rounded-full'
        },
        mode: {
            default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            icon: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0',
            link: 'text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent',
            input: "\n            justify-start font-normal hover:bg-background [&_svg]:transition-colors [&_svg]:hover:text-foreground data-[state=open]:bg-background \n            focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/30 \n            [[data-state=open]>&]:border-ring [[data-state=open]>&]:outline-hidden [[data-state=open]>&]:ring-[3px] \n            [[data-state=open]>&]:ring-ring/30 \n            aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20\n            in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10  dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20\n          "
        },
        placeholder: {
            true: 'text-muted-foreground',
            false: ''
        }
    },
    compoundVariants: [
        // Icons opacity for default mode
        {
            variant: 'ghost',
            mode: 'default',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        {
            variant: 'outline',
            mode: 'default',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        {
            variant: 'dashed',
            mode: 'default',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        {
            variant: 'secondary',
            mode: 'default',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        // Icons opacity for default mode
        {
            variant: 'outline',
            mode: 'input',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        {
            variant: 'outline',
            mode: 'icon',
            className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60'
        },
        // Auto height
        {
            size: 'xs',
            autoHeight: true,
            className: 'h-auto min-h-7'
        },
        {
            size: 'md',
            autoHeight: true,
            className: 'h-auto min-h-9'
        },
        {
            size: 'sm',
            autoHeight: true,
            className: 'h-auto min-h-8'
        },
        {
            size: 'lg',
            autoHeight: true,
            className: 'h-auto min-h-10'
        },
        // Shadow support
        {
            variant: 'primary',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'mono',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'secondary',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'outline',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'dashed',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'destructive',
            mode: 'default',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        // Shadow support
        {
            variant: 'primary',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'mono',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'secondary',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'outline',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'dashed',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        {
            variant: 'destructive',
            mode: 'icon',
            appearance: 'default',
            className: 'shadow-xs shadow-black/5'
        },
        // Link
        {
            variant: 'primary',
            mode: 'link',
            underline: 'solid',
            className: 'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid'
        },
        {
            variant: 'primary',
            mode: 'link',
            underline: 'dashed',
            className: 'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1'
        },
        {
            variant: 'primary',
            mode: 'link',
            underlined: 'solid',
            className: 'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid'
        },
        {
            variant: 'primary',
            mode: 'link',
            underlined: 'dashed',
            className: 'font-medium text-primary hover:text-primary/90 [&_svg]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1'
        },
        {
            variant: 'inverse',
            mode: 'link',
            underline: 'solid',
            className: 'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid'
        },
        {
            variant: 'inverse',
            mode: 'link',
            underline: 'dashed',
            className: 'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1'
        },
        {
            variant: 'inverse',
            mode: 'link',
            underlined: 'solid',
            className: 'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid'
        },
        {
            variant: 'inverse',
            mode: 'link',
            underlined: 'dashed',
            className: 'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1'
        },
        {
            variant: 'foreground',
            mode: 'link',
            underline: 'solid',
            className: 'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid'
        },
        {
            variant: 'foreground',
            mode: 'link',
            underline: 'dashed',
            className: 'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1'
        },
        {
            variant: 'foreground',
            mode: 'link',
            underlined: 'solid',
            className: 'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid'
        },
        {
            variant: 'foreground',
            mode: 'link',
            underlined: 'dashed',
            className: 'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1'
        },
        // Ghost
        {
            variant: 'primary',
            appearance: 'ghost',
            className: 'bg-transparent text-primary/90 hover:bg-primary/5 data-[state=open]:bg-primary/5'
        },
        {
            variant: 'destructive',
            appearance: 'ghost',
            className: 'bg-transparent text-destructive/90 hover:bg-destructive/5 data-[state=open]:bg-destructive/5'
        },
        {
            variant: 'ghost',
            mode: 'icon',
            className: 'text-muted-foreground'
        },
        // Size
        {
            size: 'xs',
            mode: 'icon',
            className: 'w-7 h-7 p-0 [[&_svg:not([class*=size-])]:size-3.5'
        },
        {
            size: 'sm',
            mode: 'icon',
            className: 'w-8 h-8 p-0 [[&_svg:not([class*=size-])]:size-3.5'
        },
        {
            size: 'md',
            mode: 'icon',
            className: 'w-9 h-9 p-0 [&_svg:not([class*=size-])]:size-4'
        },
        {
            size: 'icon',
            className: 'w-9 h-9 p-0 [&_svg:not([class*=size-])]:size-4'
        },
        {
            size: 'lg',
            mode: 'icon',
            className: 'w-10 h-10 p-0 [&_svg:not([class*=size-])]:size-4'
        },
        // Input mode
        {
            mode: 'input',
            placeholder: true,
            variant: 'outline',
            className: 'font-normal text-muted-foreground'
        },
        {
            mode: 'input',
            variant: 'outline',
            size: 'sm',
            className: 'gap-1.25'
        },
        {
            mode: 'input',
            variant: 'outline',
            size: 'md',
            className: 'gap-1.5'
        },
        {
            mode: 'input',
            variant: 'outline',
            size: 'lg',
            className: 'gap-1.5'
        }
    ],
    defaultVariants: {
        variant: 'primary',
        mode: 'default',
        size: 'md',
        radius: 'md',
        appearance: 'default'
    }
});
function Button(param) {
    let { className, selected, variant, radius, appearance, mode, size, autoHeight, underlined, underline, asChild = false, placeholder = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Slot : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            radius,
            appearance,
            mode,
            autoHeight,
            placeholder,
            underlined,
            underline,
            className
        }), asChild && props.disabled && 'pointer-events-none opacity-50'),
        ...selected && {
            'data-state': 'open'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 392,
        columnNumber: 5
    }, this);
}
_c = Button;
function ButtonArrow(param) {
    let { icon: Icon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
        "data-slot": "button-arrow",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('ms-auto -me-1', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 420,
        columnNumber: 10
    }, this);
}
_c1 = ButtonArrow;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button");
__turbopack_context__.k.register(_c1, "ButtonArrow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function DropdownMenu(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dropdown-menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = DropdownMenu;
function DropdownMenuPortal(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dropdown-menu-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = DropdownMenuPortal;
function DropdownMenuTrigger(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dropdown-menu-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = DropdownMenuTrigger;
function DropdownMenuContent(param) {
    let { className, sideOffset = 4, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "dropdown-menu-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dropdown-menu.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = DropdownMenuContent;
function DropdownMenuGroup(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "dropdown-menu-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c4 = DropdownMenuGroup;
function DropdownMenuItem(param) {
    let { className, inset, variant = "default", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c5 = DropdownMenuItem;
function DropdownMenuCheckboxItem(param) {
    let { className, children, checked, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        "data-slot": "dropdown-menu-checkbox-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c6 = DropdownMenuCheckboxItem;
function DropdownMenuRadioGroup(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
        "data-slot": "dropdown-menu-radio-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c7 = DropdownMenuRadioGroup;
function DropdownMenuRadioItem(param) {
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        "data-slot": "dropdown-menu-radio-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                        className: "size-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c8 = DropdownMenuRadioItem;
function DropdownMenuLabel(param) {
    let { className, inset, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c9 = DropdownMenuLabel;
function DropdownMenuSeparator(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "dropdown-menu-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c10 = DropdownMenuSeparator;
function DropdownMenuShortcut(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "dropdown-menu-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground ml-auto text-xs tracking-widest", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c11 = DropdownMenuShortcut;
function DropdownMenuSub(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"], {
        "data-slot": "dropdown-menu-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_c12 = DropdownMenuSub;
function DropdownMenuSubTrigger(param) {
    let { className, inset, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        "data-slot": "dropdown-menu-sub-trigger",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                className: "ml-auto size-4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_c13 = DropdownMenuSubTrigger;
function DropdownMenuSubContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        "data-slot": "dropdown-menu-sub-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c14 = DropdownMenuSubContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "DropdownMenu");
__turbopack_context__.k.register(_c1, "DropdownMenuPortal");
__turbopack_context__.k.register(_c2, "DropdownMenuTrigger");
__turbopack_context__.k.register(_c3, "DropdownMenuContent");
__turbopack_context__.k.register(_c4, "DropdownMenuGroup");
__turbopack_context__.k.register(_c5, "DropdownMenuItem");
__turbopack_context__.k.register(_c6, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c7, "DropdownMenuRadioGroup");
__turbopack_context__.k.register(_c8, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c9, "DropdownMenuLabel");
__turbopack_context__.k.register(_c10, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c11, "DropdownMenuShortcut");
__turbopack_context__.k.register(_c12, "DropdownMenuSub");
__turbopack_context__.k.register(_c13, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c14, "DropdownMenuSubContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Separator(param) {
    let { className, orientation = "horizontal", decorative = true, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "separator",
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar,
    "SidebarContent",
    ()=>SidebarContent,
    "SidebarFooter",
    ()=>SidebarFooter,
    "SidebarHeader",
    ()=>SidebarHeader,
    "SidebarInset",
    ()=>SidebarInset,
    "SidebarProvider",
    ()=>SidebarProvider,
    "SidebarTrigger",
    ()=>SidebarTrigger,
    "useSidebar",
    ()=>useSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SidebarContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
function SidebarProvider(param) {
    let { children, defaultOpen = true } = param;
    _s();
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultOpen);
    const toggleOpen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "SidebarProvider.useCallback[toggleOpen]": ()=>{
            setOpen({
                "SidebarProvider.useCallback[toggleOpen]": (previous)=>!previous
            }["SidebarProvider.useCallback[toggleOpen]"]);
        }
    }["SidebarProvider.useCallback[toggleOpen]"], []);
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "SidebarProvider.useMemo[context]": ()=>({
                open,
                setOpen,
                toggleOpen
            })
    }["SidebarProvider.useMemo[context]"], [
        open,
        toggleOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarContext.Provider, {
        value: context,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
_s(SidebarProvider, "GW3d/fG+Yx0Qep1w7UzgdjOlDvc=");
_c = SidebarProvider;
function useSidebar() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
_s1(useSidebar, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const Sidebar = /*#__PURE__*/ _s2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = _s2((param, ref)=>{
    let { className, children, ...props } = param;
    _s2();
    const { open, setOpen } = useSidebar();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-slot": "sidebar-backdrop",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden", open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"),
                "aria-hidden": "true",
                onClick: ()=>setOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/sidebar.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                ref: ref,
                "data-slot": "sidebar",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card shadow-sm transition-transform duration-200 md:static md:translate-x-0", open ? "translate-x-0" : "-translate-x-full", className),
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/sidebar.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
}, "Um7yN0bE4gIzEu/pka2rdYB87SM=", false, function() {
    return [
        useSidebar
    ];
})), "Um7yN0bE4gIzEu/pka2rdYB87SM=", false, function() {
    return [
        useSidebar
    ];
});
_c2 = Sidebar;
Sidebar.displayName = "Sidebar";
const SidebarHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c3 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        "data-slot": "sidebar-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b px-6 py-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c4 = SidebarHeader;
SidebarHeader.displayName = "SidebarHeader";
const SidebarContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        "data-slot": "sidebar-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 overflow-y-auto px-4 py-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c6 = SidebarContent;
SidebarContent.displayName = "SidebarContent";
const SidebarFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        "data-slot": "sidebar-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t px-4 py-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c8 = SidebarFooter;
SidebarFooter.displayName = "SidebarFooter";
const SidebarTrigger = /*#__PURE__*/ _s3(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = _s3((param, ref)=>{
    let { className, children, asChild = false, onClick, ...props } = param;
    _s3();
    const { toggleOpen } = useSidebar();
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    const triggerChildren = asChild ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children !== null && children !== void 0 ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/sidebar.tsx",
                lineNumber: 115,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "Toggle sidebar"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/sidebar.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        ref: ref,
        type: asChild ? undefined : "button",
        "data-slot": "sidebar-trigger",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        onClick: (event)=>{
            onClick === null || onClick === void 0 ? void 0 : onClick(event);
            toggleOpen();
        },
        ...props,
        children: triggerChildren
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "2EwTx+a/g+lrFFCgzmWA0lZsUYQ=", false, function() {
    return [
        useSidebar
    ];
})), "2EwTx+a/g+lrFFCgzmWA0lZsUYQ=", false, function() {
    return [
        useSidebar
    ];
});
_c10 = SidebarTrigger;
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarInset = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        "data-slot": "sidebar-inset",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 overflow-hidden", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/sidebar.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c12 = SidebarInset;
SidebarInset.displayName = "SidebarInset";
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "SidebarProvider");
__turbopack_context__.k.register(_c1, "Sidebar$React.forwardRef");
__turbopack_context__.k.register(_c2, "Sidebar");
__turbopack_context__.k.register(_c3, "SidebarHeader$React.forwardRef");
__turbopack_context__.k.register(_c4, "SidebarHeader");
__turbopack_context__.k.register(_c5, "SidebarContent$React.forwardRef");
__turbopack_context__.k.register(_c6, "SidebarContent");
__turbopack_context__.k.register(_c7, "SidebarFooter$React.forwardRef");
__turbopack_context__.k.register(_c8, "SidebarFooter");
__turbopack_context__.k.register(_c9, "SidebarTrigger$React.forwardRef");
__turbopack_context__.k.register(_c10, "SidebarTrigger");
__turbopack_context__.k.register(_c11, "SidebarInset$React.forwardRef");
__turbopack_context__.k.register(_c12, "SidebarInset");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/mode-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModeToggle",
    ()=>ModeToggle,
    "ThemeDropdownMenu",
    ()=>ThemeDropdownMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as Laptop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ModeToggle() {
    _s();
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "icon",
                    "aria-label": "Toggle theme",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "sr-only",
                            children: "Toggle theme"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/mode-toggle.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/mode-toggle.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>setTheme("light"),
                        children: "Light"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/mode-toggle.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>setTheme("dark"),
                        children: "Dark"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/mode-toggle.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>setTheme("system"),
                        children: "System"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/mode-toggle.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/mode-toggle.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/mode-toggle.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(ModeToggle, "a3u8LKbpX4CXbd+e8SJ1SuQ9KPw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ModeToggle;
function ThemeDropdownMenu() {
    _s1();
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    var _ref;
    const selectedTheme = (_ref = theme) !== null && _ref !== void 0 ? _ref : "system";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSub"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSubTrigger"], {
                className: "gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/mode-toggle.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Appearance"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/mode-toggle.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/mode-toggle.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSubContent"], {
                className: "w-48",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioGroup"], {
                    value: selectedTheme,
                    onValueChange: (value)=>setTheme(value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                            value: "light",
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/mode-toggle.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                "Light"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                            value: "dark",
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/mode-toggle.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this),
                                "Dark"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                            value: "system",
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__["Laptop"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/mode-toggle.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                "System"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/mode-toggle.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/mode-toggle.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/mode-toggle.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/mode-toggle.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s1(ThemeDropdownMenu, "5ABGV54qnXKp6rHn7MS/8MjwRhQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c1 = ThemeDropdownMenu;
var _c, _c1;
__turbopack_context__.k.register(_c, "ModeToggle");
__turbopack_context__.k.register(_c1, "ThemeDropdownMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-accent animate-pulse rounded-md", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const Spinner = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, loading = true, ...props } = param;
    if (!loading) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 animate-spin text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/spinner.tsx",
        lineNumber: 16,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Spinner;
Spinner.displayName = "Spinner";
var _c, _c1;
__turbopack_context__.k.register(_c, "Spinner$React.forwardRef");
__turbopack_context__.k.register(_c1, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data-client/user-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpdateUserSettings",
    ()=>useUpdateUserSettings,
    "useUserSettings",
    ()=>useUserSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data-client/keys.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/notifications.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
async function fetchUserSettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])('/api/user/settings');
}
function useUserSettings() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userKeys"].settings(),
        queryFn: fetchUserSettings,
        staleTime: 60_000
    });
}
_s(useUserSettings, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUpdateUserSettings() {
    _s1();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            'user',
            'settings',
            'update'
        ],
        mutationFn: {
            "useUpdateUserSettings.useMutation": async (payload)=>{
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])('/api/user/settings', {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
            }
        }["useUpdateUserSettings.useMutation"],
        onSuccess: {
            "useUpdateUserSettings.useMutation": (data)=>{
                queryClient.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$keys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userKeys"].settings(), data);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success('Profile updated.');
            }
        }["useUpdateUserSettings.useMutation"],
        onError: {
            "useUpdateUserSettings.useMutation": (error)=>{
                const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : 'Failed to update profile.';
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error(message);
            }
        }["useUpdateUserSettings.useMutation"]
    });
}
_s1(useUpdateUserSettings, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layouts/main-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainSidebar",
    ()=>MainSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-client] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/mode-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$organizations$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/organizations/context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$user$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data-client/user-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/notifications.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
;
;
const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"]
    },
    {
        name: 'Requests',
        href: '/requests',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"]
    },
    {
        name: 'Contacts',
        href: '/contacts',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function MainSidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"])();
    const [pendingHref, setPendingHref] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingOrganizationSwitch, setPendingOrganizationSwitch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastSwitchToastId, setLastSwitchToastId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { acceptedOrganizations, pendingInvites, activeOrganizationId, setActiveOrganizationId, isLoading, isError, error, currentOrganization, refetch, isBootstrapping } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$organizations$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrganizationContext"])();
    const hasAcceptedOrganizations = acceptedOrganizations.length > 0;
    const { data: userSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$user$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserSettings"])();
    const user = userSettings === null || userSettings === void 0 ? void 0 : userSettings.user;
    var _user_name, _ref;
    const userDisplayName = (_ref = (_user_name = user === null || user === void 0 ? void 0 : user.name) !== null && _user_name !== void 0 ? _user_name : user === null || user === void 0 ? void 0 : user.email) !== null && _ref !== void 0 ? _ref : 'Your account';
    var _user_email;
    const userEmail = (_user_email = user === null || user === void 0 ? void 0 : user.email) !== null && _user_email !== void 0 ? _user_email : 'user@example.com';
    var _user_avatar_url;
    const userAvatarUrl = (_user_avatar_url = user === null || user === void 0 ? void 0 : user.avatar_url) !== null && _user_avatar_url !== void 0 ? _user_avatar_url : null;
    const userInitials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MainSidebar.useMemo[userInitials]": ()=>{
            const source = (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email) || 'U';
            return source.split(/[\s@]+/).filter(Boolean).map({
                "MainSidebar.useMemo[userInitials]": (segment)=>{
                    var _segment_;
                    var _segment__toUpperCase;
                    return (_segment__toUpperCase = (_segment_ = segment[0]) === null || _segment_ === void 0 ? void 0 : _segment_.toUpperCase()) !== null && _segment__toUpperCase !== void 0 ? _segment__toUpperCase : '';
                }
            }["MainSidebar.useMemo[userInitials]"]).join('').slice(0, 2) || 'U';
        }
    }["MainSidebar.useMemo[userInitials]"], [
        user === null || user === void 0 ? void 0 : user.name,
        user === null || user === void 0 ? void 0 : user.email
    ]);
    const activeOrganization = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MainSidebar.useMemo[activeOrganization]": ()=>{
            if (!acceptedOrganizations.length) {
                return null;
            }
            var _acceptedOrganizations_find;
            return (_acceptedOrganizations_find = acceptedOrganizations.find({
                "MainSidebar.useMemo[activeOrganization]": (org)=>org.id === activeOrganizationId
            }["MainSidebar.useMemo[activeOrganization]"])) !== null && _acceptedOrganizations_find !== void 0 ? _acceptedOrganizations_find : acceptedOrganizations[0];
        }
    }["MainSidebar.useMemo[activeOrganization]"], [
        acceptedOrganizations,
        activeOrganizationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainSidebar.useEffect": ()=>{
            if (isLoading || !activeOrganization) {
                return;
            }
            navigation.forEach({
                "MainSidebar.useEffect": (item)=>{
                    router.prefetch(item.href);
                }
            }["MainSidebar.useEffect"]);
        }
    }["MainSidebar.useEffect"], [
        router,
        isLoading,
        activeOrganization
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainSidebar.useEffect": ()=>{
            if (isLoading || isBootstrapping) {
                return;
            }
            if (!hasAcceptedOrganizations) {
                if (pathname !== '/no-organization' && !(pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/settings'))) {
                    router.replace('/no-organization');
                }
                return;
            }
            if (!activeOrganization) {
                return;
            }
            if (pathname === '/no-organization') {
                router.replace('/dashboard');
            }
        }
    }["MainSidebar.useEffect"], [
        activeOrganization,
        hasAcceptedOrganizations,
        isBootstrapping,
        isLoading,
        pathname,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainSidebar.useEffect": ()=>{
            if (!pendingHref) {
                return;
            }
            if (pathname === pendingHref || (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith("".concat(pendingHref, "/")))) {
                setPendingHref(null);
            }
        }
    }["MainSidebar.useEffect"], [
        pathname,
        pendingHref
    ]);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MainSidebar.useCallback[handleLogout]": async ()=>{
            if (isLoggingOut) {
                return;
            }
            setIsLoggingOut(true);
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to logout');
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        window.localStorage.removeItem('carbonreport.activeOrganizationId');
                    } catch (e) {
                    // ignore storage errors
                    }
                }
                router.replace('/login');
                router.refresh();
            } catch (error) {
                console.error('Logout failed', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].error('Failed to logout. Please try again.');
            } finally{
                setIsLoggingOut(false);
            }
        }
    }["MainSidebar.useCallback[handleLogout]"], [
        isLoggingOut,
        router
    ]);
    const showLockedNav = !isLoading && !isBootstrapping && !activeOrganization;
    const handleOrganizationSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MainSidebar.useCallback[handleOrganizationSelect]": (organization)=>{
            if (organization.id === (activeOrganization === null || activeOrganization === void 0 ? void 0 : activeOrganization.id)) {
                return;
            }
            setPendingOrganizationSwitch({
                id: organization.id,
                name: organization.display_name,
                startedAt: Date.now()
            });
            setActiveOrganizationId(organization.id);
        }
    }["MainSidebar.useCallback[handleOrganizationSelect]"], [
        activeOrganization === null || activeOrganization === void 0 ? void 0 : activeOrganization.id,
        setActiveOrganizationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainSidebar.useEffect": ()=>{
            if (!pendingOrganizationSwitch) {
                return;
            }
            if (activeOrganizationId !== pendingOrganizationSwitch.id) {
                return;
            }
            const MIN_DISPLAY_MS = 400;
            const elapsed = Date.now() - pendingOrganizationSwitch.startedAt;
            const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
            const timeout = window.setTimeout({
                "MainSidebar.useEffect.timeout": ()=>{
                    setPendingOrganizationSwitch(null);
                }
            }["MainSidebar.useEffect.timeout"], remaining);
            if (lastSwitchToastId !== pendingOrganizationSwitch.id) {
                var _activeOrganization_display_name;
                const label = (_activeOrganization_display_name = activeOrganization === null || activeOrganization === void 0 ? void 0 : activeOrganization.display_name) !== null && _activeOrganization_display_name !== void 0 ? _activeOrganization_display_name : pendingOrganizationSwitch.name;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"].success("Switched to ".concat(label));
                setLastSwitchToastId(pendingOrganizationSwitch.id);
            }
            return ({
                "MainSidebar.useEffect": ()=>{
                    window.clearTimeout(timeout);
                }
            })["MainSidebar.useEffect"];
        }
    }["MainSidebar.useEffect"], [
        activeOrganization === null || activeOrganization === void 0 ? void 0 : activeOrganization.display_name,
        activeOrganizationId,
        lastSwitchToastId,
        pendingOrganizationSwitch
    ]);
    var _currentOrganization_usage_active_projects, _currentOrganization_plan_max_active_projects, _currentOrganization_plan_label, _ref1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarHeader"], {
                className: "space-y-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrganizationSwitcher, {
                    activeOrganization: activeOrganization,
                    acceptedOrganizations: acceptedOrganizations,
                    pendingInvites: pendingInvites,
                    isLoading: isLoading,
                    isError: isError,
                    error: error,
                    onRetry: refetch,
                    onSelect: handleOrganizationSelect,
                    onCreate: ()=>router.push('/settings/profile?mode=create'),
                    activeUsage: (_currentOrganization_usage_active_projects = currentOrganization === null || currentOrganization === void 0 ? void 0 : currentOrganization.usage.active_projects) !== null && _currentOrganization_usage_active_projects !== void 0 ? _currentOrganization_usage_active_projects : null,
                    usageLimit: (_currentOrganization_plan_max_active_projects = currentOrganization === null || currentOrganization === void 0 ? void 0 : currentOrganization.plan.max_active_projects) !== null && _currentOrganization_plan_max_active_projects !== void 0 ? _currentOrganization_plan_max_active_projects : null,
                    planLabel: (_ref1 = (_currentOrganization_plan_label = currentOrganization === null || currentOrganization === void 0 ? void 0 : currentOrganization.plan.label) !== null && _currentOrganization_plan_label !== void 0 ? _currentOrganization_plan_label : activeOrganization === null || activeOrganization === void 0 ? void 0 : activeOrganization.plan_label) !== null && _ref1 !== void 0 ? _ref1 : '—',
                    isSwitching: Boolean(pendingOrganizationSwitch)
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarContent"], {
                className: "space-y-1",
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationSkeleton, {}, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 244,
                    columnNumber: 11
                }, this) : showLockedNav ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-dashed border-muted-foreground/40 p-4 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-foreground",
                            children: "Workspace locked"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-xs text-muted-foreground",
                            children: "Join an existing organization or create a new one to unlock navigation."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 246,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "space-y-1",
                    children: navigation.map((item)=>{
                        const isExactMatch = pathname === item.href;
                        const isWithinSection = !isExactMatch && (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(item.href + '/'));
                        const isActive = isExactMatch || isWithinSection;
                        const Icon = item.icon;
                        const isPending = pendingHref === item.href;
                        const isHighlighted = pendingHref ? isPending : isActive;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            onClick: (event)=>{
                                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
                                    setOpen(false);
                                    return;
                                }
                                event.preventDefault();
                                if (!isExactMatch) {
                                    setPendingHref(item.href);
                                    router.push(item.href);
                                } else {
                                    setPendingHref(null);
                                }
                                setOpen(false);
                            },
                            "aria-current": isActive && !pendingHref ? 'page' : undefined,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isHighlighted ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 297,
                                    columnNumber: 19
                                }, this),
                                item.name
                            ]
                        }, item.name, true, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 263,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 253,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarFooter"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                        className: "h-9 w-9",
                                        children: [
                                            userAvatarUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                src: userAvatarUrl,
                                                alt: userDisplayName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                lineNumber: 314,
                                                columnNumber: 34
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                className: "bg-primary text-primary-foreground text-sm",
                                                children: userInitials
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                lineNumber: 315,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 313,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-sm font-medium",
                                                children: userDisplayName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                lineNumber: 320,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-xs text-muted-foreground",
                                                children: userEmail
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                lineNumber: 321,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                        className: "h-4 w-4 text-muted-foreground",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 323,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Open user menu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            className: "w-56",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                    children: userDisplayName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 328,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    className: "gap-2",
                                    onSelect: (event)=>{
                                        event.preventDefault();
                                        router.push('/profile');
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this),
                                        "Profile settings"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeDropdownMenu"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 340,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    className: "gap-2 text-destructive",
                                    onSelect: (event)=>{
                                        event.preventDefault();
                                        void handleLogout();
                                    },
                                    disabled: isLoggingOut,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 350,
                                            columnNumber: 15
                                        }, this),
                                        isLoggingOut ? 'Logging out…' : 'Logout'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 307,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            pendingOrganizationSwitch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrganizationSwitchPreloader, {
                organizationName: pendingOrganizationSwitch.name
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 357,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(MainSidebar, "aWMBDcjzz0FJoSOixNRLNiuedp8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebar"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$organizations$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrganizationContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2d$client$2f$user$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserSettings"]
    ];
});
_c = MainSidebar;
function OrganizationSwitcher(param) {
    let { activeOrganization, acceptedOrganizations, pendingInvites, isLoading, isError, error, onRetry, onSelect, onCreate, activeUsage, usageLimit, planLabel, isSwitching } = param;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-9 w-full animate-pulse rounded-md bg-muted"
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 397,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 w-2/3 animate-pulse rounded bg-muted"
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 398,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
            lineNumber: 396,
            columnNumber: 7
        }, this);
    }
    if (isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Failed to load organizations."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 408,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 406,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "link",
                    size: "sm",
                    onClick: onRetry,
                    className: "px-0 text-destructive",
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, this),
                error instanceof Error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs text-destructive/80",
                    children: error.message
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 414,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
            lineNumber: 405,
            columnNumber: 7
        }, this);
    }
    if (!activeOrganization) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start gap-3 rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-foreground",
                            children: "No organization yet"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "If your company already uses Carbon Report, ask a teammate to invite you from Organization → Members."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 424,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "Only create a new organization if you are the first person from your company to join the platform."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 422,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    onClick: onCreate,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 432,
                            columnNumber: 11
                        }, this),
                        "Create organization"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 431,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
            lineNumber: 421,
            columnNumber: 7
        }, this);
    }
    const getInitials = (value)=>value.split(' ').map((segment)=>segment[0]).join('').slice(0, 2).toUpperCase();
    const initials = getInitials(activeOrganization.display_name);
    var _activeOrganization_logo_url;
    const activeLogoUrl = (_activeOrganization_logo_url = activeOrganization.logo_url) !== null && _activeOrganization_logo_url !== void 0 ? _activeOrganization_logo_url : null;
    const usageLabel = typeof activeUsage === 'number' && typeof usageLimit === 'number' ? "".concat(activeUsage, " / ").concat(usageLimit) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                            className: "h-9 w-9 rounded-md",
                            children: [
                                activeLogoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                    src: activeLogoUrl,
                                    alt: "".concat(activeOrganization.display_name, " logo")
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 464,
                                    columnNumber: 15
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                    className: "rounded-md bg-muted text-sm font-semibold",
                                    children: initials || '—'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 466,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "truncate text-sm font-medium",
                                    children: activeOrganization.display_name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                                    children: [
                                        isSwitching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                                            className: "h-3 w-3 text-primary",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 473,
                                            columnNumber: 30
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: [
                                                planLabel,
                                                usageLabel ? " · ".concat(usageLabel, " projects") : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 474,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 472,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 480,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "sr-only",
                            children: "Open organization menu"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 481,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 458,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 457,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                className: "w-64",
                align: "start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                        className: "text-xs text-muted-foreground",
                        children: "Organizations"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                        lineNumber: 485,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                        lineNumber: 486,
                        columnNumber: 9
                    }, this),
                    acceptedOrganizations.map((organization)=>{
                        var _organization_limits;
                        const initialsLabel = getInitials(organization.display_name);
                        var _organization_logo_url;
                        const logoUrl = (_organization_logo_url = organization.logo_url) !== null && _organization_logo_url !== void 0 ? _organization_logo_url : null;
                        const isActive = organization.id === activeOrganization.id;
                        const limit = (_organization_limits = organization.limits) === null || _organization_limits === void 0 ? void 0 : _organization_limits.max_active_projects;
                        const usage = organization.active_projects;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                            onSelect: ()=>onSelect(organization),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('gap-3 p-2', isActive && 'bg-muted text-foreground'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    className: "h-8 w-8 rounded-md",
                                    children: [
                                        logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                            src: logoUrl,
                                            alt: "".concat(organization.display_name, " logo")
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 502,
                                            columnNumber: 19
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                            className: "rounded-md bg-muted text-sm font-semibold",
                                            children: initialsLabel || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate text-sm font-medium",
                                            children: organization.display_name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate text-xs text-muted-foreground",
                                            children: organization.plan_label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 510,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this),
                                typeof usage === 'number' && typeof limit === 'number' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "secondary",
                                    className: "ml-auto text-xs",
                                    children: [
                                        usage,
                                        " / ",
                                        limit
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 513,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, organization.id, true, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 495,
                            columnNumber: 13
                        }, this);
                    }),
                    pendingInvites.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                className: "my-1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 523,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                className: "text-xs text-muted-foreground",
                                children: "Pending invites"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            pendingInvites.map((invite)=>{
                                const initialsLabel = getInitials(invite.display_name);
                                var _invite_logo_url;
                                const logoUrl = (_invite_logo_url = invite.logo_url) !== null && _invite_logo_url !== void 0 ? _invite_logo_url : null;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    disabled: true,
                                    className: "gap-3 p-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                            className: "h-8 w-8 rounded-md",
                                            children: [
                                                logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                    src: logoUrl,
                                                    alt: "".concat(invite.display_name, " logo")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 23
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                    className: "rounded-md bg-muted text-sm font-semibold text-muted-foreground",
                                                    children: initialsLabel || '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 532,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex min-w-0 flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-sm font-medium text-muted-foreground",
                                                    children: invite.display_name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-xs text-muted-foreground",
                                                    children: "Invite pending"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                            lineNumber: 540,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, invite.id, true, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                        lineNumber: 552,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        className: "gap-3 p-2 text-muted-foreground",
                        onSelect: onCreate,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-8 w-8 items-center justify-center rounded-md bg-muted",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                    lineNumber: 555,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 554,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate text-sm font-medium",
                                        children: "Create organization"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 558,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate text-xs",
                                        children: "Spin up a new workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                        lineNumber: 559,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                                lineNumber: 557,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                        lineNumber: 553,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
        lineNumber: 456,
        columnNumber: 5
    }, this);
}
_c1 = OrganizationSwitcher;
function NavigationSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: Array.from({
            length: 4
        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-10 w-full rounded-lg"
            }, "sidebar-skeleton-".concat(index), false, {
                fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                lineNumber: 571,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
        lineNumber: 569,
        columnNumber: 5
    }, this);
}
_c2 = NavigationSkeleton;
function OrganizationSwitchPreloader(param) {
    let { organizationName } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm",
        role: "status",
        "aria-live": "assertive",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "flex items-center gap-3 px-6 py-4 shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                    className: "h-6 w-6 text-primary",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 581,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium",
                            children: "Switching organization…"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 583,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-muted-foreground",
                            children: organizationName
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                            lineNumber: 584,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/main-sidebar.tsx",
                    lineNumber: 582,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layouts/main-sidebar.tsx",
            lineNumber: 580,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/main-sidebar.tsx",
        lineNumber: 579,
        columnNumber: 5
    }, this);
}
_c3 = OrganizationSwitchPreloader;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MainSidebar");
__turbopack_context__.k.register(_c1, "OrganizationSwitcher");
__turbopack_context__.k.register(_c2, "NavigationSkeleton");
__turbopack_context__.k.register(_c3, "OrganizationSwitchPreloader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layouts/dashboard-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardLayout",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$main$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layouts/main-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelsTopLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-client] (ecmascript) <export default as PanelsTopLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const paddingClassMap = {
    default: 'p-6',
    horizontal: 'px-6',
    none: ''
};
function DashboardLayout(param) {
    let { children, contentPadding = 'default', contentClassName } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarProvider"], {
        defaultOpen: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$main$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MainSidebar"], {}, void 0, false, {
                        fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarInset"], {
                    className: "flex flex-1 flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "flex items-center justify-between border-b px-4 py-3 md:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            "aria-label": "Toggle menu",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelsTopLeft$3e$__["PanelsTopLeft"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                                lineNumber: 33,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                            lineNumber: 32,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                        lineNumber: 31,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-muted-foreground",
                                        children: "Carbon Report"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 overflow-y-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('container mx-auto max-w-7xl', paddingClassMap[contentPadding], contentClassName),
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/dashboard-layout.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/stepper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Stepper",
    ()=>Stepper,
    "StepperContent",
    ()=>StepperContent,
    "StepperDescription",
    ()=>StepperDescription,
    "StepperIndicator",
    ()=>StepperIndicator,
    "StepperItem",
    ()=>StepperItem,
    "StepperNav",
    ()=>StepperNav,
    "StepperPanel",
    ()=>StepperPanel,
    "StepperSeparator",
    ()=>StepperSeparator,
    "StepperTitle",
    ()=>StepperTitle,
    "StepperTrigger",
    ()=>StepperTrigger,
    "useStepItem",
    ()=>useStepItem,
    "useStepper",
    ()=>useStepper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature();
'use client';
;
;
;
const StepperContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const StepItemContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useStepper() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StepperContext);
    if (!ctx) throw new Error('useStepper must be used within a Stepper');
    return ctx;
}
_s(useStepper, "/dMy7t63NXD4eYACoT93CePwGrg=");
function useStepItem() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StepItemContext);
    if (!ctx) throw new Error('useStepItem must be used within a StepperItem');
    return ctx;
}
_s1(useStepItem, "/dMy7t63NXD4eYACoT93CePwGrg=");
function Stepper(param) {
    let { defaultValue = 1, value, onValueChange, orientation = 'horizontal', className, children, indicators = {}, ...props } = param;
    _s2();
    const [activeStep, setActiveStep] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultValue);
    const [triggerNodes, setTriggerNodes] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    // Register/unregister triggers
    const registerTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[registerTrigger]": (node)=>{
            setTriggerNodes({
                "Stepper.useCallback[registerTrigger]": (prev)=>{
                    if (prev.includes(node)) return prev;
                    return [
                        ...prev,
                        node
                    ];
                }
            }["Stepper.useCallback[registerTrigger]"]);
        }
    }["Stepper.useCallback[registerTrigger]"], []);
    const unregisterTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[unregisterTrigger]": (node)=>{
            setTriggerNodes({
                "Stepper.useCallback[unregisterTrigger]": (prev)=>prev.filter({
                        "Stepper.useCallback[unregisterTrigger]": (entry)=>entry !== node
                    }["Stepper.useCallback[unregisterTrigger]"])
            }["Stepper.useCallback[unregisterTrigger]"]);
        }
    }["Stepper.useCallback[unregisterTrigger]"], []);
    const handleSetActiveStep = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[handleSetActiveStep]": (step)=>{
            if (value === undefined) {
                setActiveStep(step);
            }
            onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(step);
        }
    }["Stepper.useCallback[handleSetActiveStep]"], [
        value,
        onValueChange
    ]);
    const currentStep = value !== null && value !== void 0 ? value : activeStep;
    // Keyboard navigation logic
    const focusTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[focusTrigger]": (idx)=>{
            const node = triggerNodes[idx];
            if (node) {
                node.focus();
            }
        }
    }["Stepper.useCallback[focusTrigger]"], [
        triggerNodes
    ]);
    const focusNext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[focusNext]": (currentIdx)=>{
            if (triggerNodes.length === 0) return;
            focusTrigger((currentIdx + 1) % triggerNodes.length);
        }
    }["Stepper.useCallback[focusNext]"], [
        focusTrigger,
        triggerNodes
    ]);
    const focusPrev = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[focusPrev]": (currentIdx)=>{
            if (triggerNodes.length === 0) return;
            focusTrigger((currentIdx - 1 + triggerNodes.length) % triggerNodes.length);
        }
    }["Stepper.useCallback[focusPrev]"], [
        focusTrigger,
        triggerNodes
    ]);
    const focusFirst = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[focusFirst]": ()=>{
            if (triggerNodes.length === 0) return;
            focusTrigger(0);
        }
    }["Stepper.useCallback[focusFirst]"], [
        focusTrigger,
        triggerNodes
    ]);
    const focusLast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "Stepper.useCallback[focusLast]": ()=>{
            if (triggerNodes.length === 0) return;
            focusTrigger(triggerNodes.length - 1);
        }
    }["Stepper.useCallback[focusLast]"], [
        focusTrigger,
        triggerNodes
    ]);
    // Context value
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "Stepper.useMemo[contextValue]": ()=>({
                activeStep: currentStep,
                setActiveStep: handleSetActiveStep,
                stepsCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children).filter({
                    "Stepper.useMemo[contextValue]": (child)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](child) && child.type.displayName === 'StepperItem'
                }["Stepper.useMemo[contextValue]"]).length,
                orientation,
                registerTrigger,
                unregisterTrigger,
                focusNext,
                focusPrev,
                focusFirst,
                focusLast,
                triggerNodes,
                indicators
            })
    }["Stepper.useMemo[contextValue]"], [
        currentStep,
        handleSetActiveStep,
        children,
        orientation,
        registerTrigger,
        unregisterTrigger,
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
        triggerNodes,
        indicators
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepperContext.Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "tablist",
            "aria-orientation": orientation,
            "data-slot": "stepper",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full', className),
            "data-orientation": orientation,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/stepper.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_s2(Stepper, "9wWXe8UezDQF3Gh9Rd9QJMm6Z+E=");
_c = Stepper;
function StepperItem(param) {
    let { step, completed = false, disabled = false, loading = false, className, children, ...props } = param;
    _s3();
    const { activeStep } = useStepper();
    const state = completed || step < activeStep ? 'completed' : activeStep === step ? 'active' : 'inactive';
    const isLoading = loading && step === activeStep;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItemContext.Provider, {
        value: {
            step,
            state,
            isDisabled: disabled,
            isLoading
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "stepper-item",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group/step flex items-center justify-center group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col not-last:flex-1', className),
            "data-state": state,
            ...isLoading ? {
                'data-loading': true
            } : {},
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/stepper.tsx",
            lineNumber: 207,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_s3(StepperItem, "6aL1v9OtemdZkPOhyr+d7UEOHkI=", false, function() {
    return [
        useStepper
    ];
});
_c1 = StepperItem;
function StepperTrigger(param) {
    let { asChild = false, className, children, tabIndex, ...props } = param;
    _s4();
    const { state, isLoading } = useStepItem();
    const stepperCtx = useStepper();
    const { setActiveStep, activeStep, registerTrigger, unregisterTrigger, triggerNodes, focusNext, focusPrev, focusFirst, focusLast } = stepperCtx;
    const { step, isDisabled } = useStepItem();
    const isSelected = activeStep === step;
    const id = "stepper-tab-".concat(step);
    const panelId = "stepper-panel-".concat(step);
    // Register this trigger for keyboard navigation
    const btnRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "StepperTrigger.useEffect": ()=>{
            const node = btnRef.current;
            if (!node) return;
            registerTrigger(node);
            return ({
                "StepperTrigger.useEffect": ()=>{
                    unregisterTrigger(node);
                }
            })["StepperTrigger.useEffect"];
        }
    }["StepperTrigger.useEffect"], [
        registerTrigger,
        unregisterTrigger
    ]);
    // Find our index among triggers for navigation
    const myIdx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "StepperTrigger.useMemo[myIdx]": ()=>{
            if (!btnRef.current) return -1;
            return triggerNodes.findIndex({
                "StepperTrigger.useMemo[myIdx]": (n)=>n === btnRef.current
            }["StepperTrigger.useMemo[myIdx]"]);
        }
    }["StepperTrigger.useMemo[myIdx]"], [
        triggerNodes
    ]);
    const handleKeyDown = (e)=>{
        switch(e.key){
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                if (myIdx !== -1 && focusNext) focusNext(myIdx);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                if (myIdx !== -1 && focusPrev) focusPrev(myIdx);
                break;
            case 'Home':
                e.preventDefault();
                if (focusFirst) focusFirst();
                break;
            case 'End':
                e.preventDefault();
                if (focusLast) focusLast();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                setActiveStep(step);
                break;
        }
    };
    if (asChild) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            "data-slot": "stepper-trigger",
            "data-state": state,
            className: className,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/stepper.tsx",
            lineNumber: 293,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: btnRef,
        role: "tab",
        id: id,
        "aria-selected": isSelected,
        "aria-controls": panelId,
        tabIndex: typeof tabIndex === 'number' ? tabIndex : isSelected ? 0 : -1,
        "data-slot": "stepper-trigger",
        "data-state": state,
        "data-loading": isLoading,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-60', className),
        onClick: ()=>setActiveStep(step),
        onKeyDown: handleKeyDown,
        disabled: isDisabled,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_s4(StepperTrigger, "evZ7MFR0uj/Hk1EmTi0UNpqwgI8=", false, function() {
    return [
        useStepItem,
        useStepper,
        useStepItem
    ];
});
_c2 = StepperTrigger;
function StepperIndicator(param) {
    let { children, className } = param;
    _s5();
    const { state, isLoading } = useStepItem();
    const { indicators } = useStepper();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "stepper-indicator",
        "data-state": state,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative flex items-center overflow-hidden justify-center size-6 shrink-0 border-background bg-accent text-accent-foreground rounded-full text-xs data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute",
            children: indicators && (isLoading && indicators.loading || state === 'completed' && indicators.completed || state === 'active' && indicators.active || state === 'inactive' && indicators.inactive) ? isLoading && indicators.loading || state === 'completed' && indicators.completed || state === 'active' && indicators.active || state === 'inactive' && indicators.inactive : children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/stepper.tsx",
            lineNumber: 337,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 329,
        columnNumber: 5
    }, this);
}
_s5(StepperIndicator, "Ws2G404OsZMbJTU/xU81PrhLTIY=", false, function() {
    return [
        useStepItem,
        useStepper
    ];
});
_c3 = StepperIndicator;
function StepperSeparator(param) {
    let { className } = param;
    _s6();
    const { state } = useStepItem();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "stepper-separator",
        "data-state": state,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('m-0.5 rounded-full bg-muted group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5 group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1', className)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 357,
        columnNumber: 5
    }, this);
}
_s6(StepperSeparator, "N2Ah2z1D3vMFvJb9J35cNmK+QBw=", false, function() {
    return [
        useStepItem
    ];
});
_c4 = StepperSeparator;
function StepperTitle(param) {
    let { children, className } = param;
    _s7();
    const { state } = useStepItem();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        "data-slot": "stepper-title",
        "data-state": state,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm font-medium leading-none', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 372,
        columnNumber: 5
    }, this);
}
_s7(StepperTitle, "N2Ah2z1D3vMFvJb9J35cNmK+QBw=", false, function() {
    return [
        useStepItem
    ];
});
_c5 = StepperTitle;
function StepperDescription(param) {
    let { children, className } = param;
    _s8();
    const { state } = useStepItem();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "stepper-description",
        "data-state": state,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 382,
        columnNumber: 5
    }, this);
}
_s8(StepperDescription, "N2Ah2z1D3vMFvJb9J35cNmK+QBw=", false, function() {
    return [
        useStepItem
    ];
});
_c6 = StepperDescription;
function StepperNav(param) {
    let { children, className } = param;
    _s9();
    const { activeStep, orientation } = useStepper();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "data-slot": "stepper-nav",
        "data-state": activeStep,
        "data-orientation": orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 392,
        columnNumber: 5
    }, this);
}
_s9(StepperNav, "FYW4tvXzHy41wbnxWncWjafblbQ=", false, function() {
    return [
        useStepper
    ];
});
_c7 = StepperNav;
function StepperPanel(param) {
    let { children, className } = param;
    _s10();
    const { activeStep } = useStepper();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "stepper-panel",
        "data-state": activeStep,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
_s10(StepperPanel, "6aL1v9OtemdZkPOhyr+d7UEOHkI=", false, function() {
    return [
        useStepper
    ];
});
_c8 = StepperPanel;
function StepperContent(param) {
    let { value, forceMount, children, className } = param;
    _s11();
    const { activeStep } = useStepper();
    const isActive = value === activeStep;
    if (!forceMount && !isActive) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "stepper-content",
        "data-state": activeStep,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full', className, !isActive && forceMount && 'hidden'),
        hidden: !isActive && forceMount,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stepper.tsx",
        lineNumber: 430,
        columnNumber: 5
    }, this);
}
_s11(StepperContent, "6aL1v9OtemdZkPOhyr+d7UEOHkI=", false, function() {
    return [
        useStepper
    ];
});
_c9 = StepperContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Stepper");
__turbopack_context__.k.register(_c1, "StepperItem");
__turbopack_context__.k.register(_c2, "StepperTrigger");
__turbopack_context__.k.register(_c3, "StepperIndicator");
__turbopack_context__.k.register(_c4, "StepperSeparator");
__turbopack_context__.k.register(_c5, "StepperTitle");
__turbopack_context__.k.register(_c6, "StepperDescription");
__turbopack_context__.k.register(_c7, "StepperNav");
__turbopack_context__.k.register(_c8, "StepperPanel");
__turbopack_context__.k.register(_c9, "StepperContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/stepper/title-status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TitleStatusStepper",
    ()=>TitleStatusStepper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/stepper.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const DEFAULT_LABELS = {
    completed: 'Готово',
    active: 'Текущий блок',
    upcoming: 'Ожидает'
};
function TitleStatusStepper(param) {
    let { steps, activeIndex, onStepChange, className, labels, disableFutureSteps = false } = param;
    const mergedLabels = {
        ...DEFAULT_LABELS,
        ...labels
    };
    const handleValueChange = (value)=>{
        const nextIndex = Math.max(0, Math.min(steps.length - 1, value - 1));
        if (disableFutureSteps && nextIndex > activeIndex) return;
        if (nextIndex === activeIndex) return;
        onStepChange === null || onStepChange === void 0 ? void 0 : onStepChange(nextIndex);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stepper"], {
        value: Math.min(steps.length, Math.max(1, activeIndex + 1)),
        onValueChange: handleValueChange,
        indicators: {
            completed: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/stepper/title-status.tsx",
                lineNumber: 55,
                columnNumber: 32
            }, void 0)
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('space-y-3', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepperNav"], {
            className: "flex w-full flex-wrap gap-3",
            children: steps.map((step, index)=>{
                const isCompleted = index < activeIndex;
                const status = isCompleted ? mergedLabels.completed : index === activeIndex ? mergedLabels.active : mergedLabels.upcoming;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepperItem"], {
                    step: index + 1,
                    completed: isCompleted,
                    disabled: disableFutureSteps && index > activeIndex,
                    className: "min-w-[220px] flex-1 items-stretch",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepperTrigger"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors', 'data-[state=active]:border-primary data-[state=active]:bg-primary/5', 'data-[state=completed]:border-primary/60 data-[state=completed]:bg-primary/5', 'data-[state=inactive]:border-muted data-[state=inactive]:bg-muted/20'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$stepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepperIndicator"], {
                                className: "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold data-[state=completed]:border-primary data-[state=active]:border-primary",
                                children: index + 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/stepper/title-status.tsx",
                                lineNumber: 83,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold leading-snug",
                                        children: step.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/stepper/title-status.tsx",
                                        lineNumber: 87,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: status
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/stepper/title-status.tsx",
                                        lineNumber: 88,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/stepper/title-status.tsx",
                                lineNumber: 86,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/stepper/title-status.tsx",
                        lineNumber: 75,
                        columnNumber: 15
                    }, this)
                }, step.id, false, {
                    fileName: "[project]/src/components/stepper/title-status.tsx",
                    lineNumber: 68,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/stepper/title-status.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/stepper/title-status.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = TitleStatusStepper;
var _c;
__turbopack_context__.k.register(_c, "TitleStatusStepper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as MinusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Checkbox(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer group inline-flex items-center justify-center align-middle border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "checkbox-indicator",
            className: "grid place-content-center text-current transition-none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                    className: "size-3 group-data-[state=indeterminate]:hidden",
                    strokeWidth: 3.5
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/checkbox.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusIcon$3e$__["MinusIcon"], {
                    className: "size-3 hidden transform translate-y-[0px] group-data-[state=indeterminate]:block group-data-[state=checked]:hidden",
                    strokeWidth: 3.5
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/checkbox.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input(param) {
    let { className, type, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/radio-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RadioGroup",
    ()=>RadioGroup,
    "RadioGroupItem",
    ()=>RadioGroupItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-radio-group/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function RadioGroup(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "radio-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-3", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/radio-group.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = RadioGroup;
function RadioGroupItem(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "radio-group-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "radio-group-indicator",
            className: "relative flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/radio-group.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/radio-group.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/radio-group.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c1 = RadioGroupItem;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "RadioGroup");
__turbopack_context__.k.register(_c1, "RadioGroupItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c = AlertDialogOverlay;
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg", "data-[state=open]:animate-in data-[state=closed]:animate-out", "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = AlertDialogContent;
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 54,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = AlertDialogHeader;
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 65,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = AlertDialogFooter;
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 76,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c6 = AlertDialogTitle;
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c8 = AlertDialogDescription;
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 100,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c10 = AlertDialogAction;
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 112,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c12 = AlertDialogCancel;
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "AlertDialogOverlay");
__turbopack_context__.k.register(_c1, "AlertDialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "AlertDialogContent");
__turbopack_context__.k.register(_c3, "AlertDialogHeader");
__turbopack_context__.k.register(_c4, "AlertDialogFooter");
__turbopack_context__.k.register(_c5, "AlertDialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "AlertDialogTitle");
__turbopack_context__.k.register(_c7, "AlertDialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction$React.forwardRef");
__turbopack_context__.k.register(_c10, "AlertDialogAction");
__turbopack_context__.k.register(_c11, "AlertDialogCancel$React.forwardRef");
__turbopack_context__.k.register(_c12, "AlertDialogCancel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/wizard-progress.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearWizardProgress",
    ()=>clearWizardProgress,
    "getWizardProgressState",
    ()=>getWizardProgressState,
    "hasAnyWizardProgress",
    ()=>hasAnyWizardProgress
]);
function clearWizardProgress() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    sessionStorage.removeItem('projectData');
    sessionStorage.removeItem('wizardAnswers');
    sessionStorage.removeItem('recommendedTemplates');
    sessionStorage.removeItem('decisionEngineResult');
}
function getWizardProgressState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let hasProjectInfo = false;
    const projectRaw = sessionStorage.getItem('projectData');
    if (projectRaw) {
        try {
            var _project_name, _project_description;
            const project = JSON.parse(projectRaw);
            hasProjectInfo = Boolean((project === null || project === void 0 ? void 0 : (_project_name = project.name) === null || _project_name === void 0 ? void 0 : _project_name.trim()) || (project === null || project === void 0 ? void 0 : (_project_description = project.description) === null || _project_description === void 0 ? void 0 : _project_description.trim()));
        } catch (e) {
            hasProjectInfo = true;
        }
    }
    let hasAnswers = false;
    const answersRaw = sessionStorage.getItem('wizardAnswers');
    if (answersRaw) {
        try {
            const answers = JSON.parse(answersRaw);
            hasAnswers = Object.values(answers || {}).some((value)=>typeof value === 'string' && value.trim().length > 0);
        } catch (e) {
            hasAnswers = true;
        }
    }
    let hasRecommendations = false;
    const recommendedRaw = sessionStorage.getItem('recommendedTemplates');
    if (recommendedRaw) {
        try {
            const recommended = JSON.parse(recommendedRaw);
            hasRecommendations = Array.isArray(recommended) && recommended.length > 0;
        } catch (e) {
            hasRecommendations = true;
        }
    }
    let hasEngineResult = false;
    const engineResultRaw = sessionStorage.getItem('decisionEngineResult');
    if (engineResultRaw) {
        try {
            const parsed = JSON.parse(engineResultRaw);
            hasEngineResult = Boolean(parsed && typeof parsed === 'object');
        } catch (e) {
            hasEngineResult = true;
        }
    }
    return {
        hasProjectInfo,
        hasAnswers,
        hasRecommendations,
        hasEngineResult
    };
}
function hasAnyWizardProgress() {
    const state = getWizardProgressState();
    return state.hasProjectInfo || state.hasAnswers || state.hasRecommendations || state.hasEngineResult;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Decision Engine Types
 *
 * Shared type definitions for the questionnaire rules engine.
 */ __turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/questions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QUESTION_DEFINITIONS",
    ()=>QUESTION_DEFINITIONS,
    "QUESTION_INDEX",
    ()=>QUESTION_INDEX
]);
const QUESTION_DEFINITIONS = [
    {
        id: 'Q0.1',
        group: 'profile',
        text: 'Страна регистрации компании?',
        type: 'single',
        options: [
            {
                code: 'EU',
                label: 'Европейский союз'
            },
            {
                code: 'UK',
                label: 'Великобритания'
            },
            {
                code: 'US',
                label: 'США'
            },
            {
                code: 'RU',
                label: 'Россия'
            },
            {
                code: 'OTHER',
                label: 'Другая страна'
            }
        ]
    },
    {
        id: 'Q0.2',
        group: 'profile',
        text: 'Отрасль деятельности',
        type: 'single',
        options: [
            {
                code: 'MANUFACTURING',
                label: 'Производство'
            },
            {
                code: 'ENERGY',
                label: 'Энергетика'
            },
            {
                code: 'TRANSPORT',
                label: 'Транспорт (авто/жд)'
            },
            {
                code: 'AVIATION',
                label: 'Авиация'
            },
            {
                code: 'MARITIME',
                label: 'Морские перевозки'
            },
            {
                code: 'FINANCE',
                label: 'Финансовый сектор'
            },
            {
                code: 'IT',
                label: 'IT / цифровые сервисы'
            },
            {
                code: 'CONSTRUCTION',
                label: 'Строительство / недвижимость'
            },
            {
                code: 'OTHER',
                label: 'Другое'
            }
        ]
    },
    {
        id: 'Q0.3',
        group: 'profile',
        text: 'Размер компании (сотрудники)',
        type: 'single',
        options: [
            {
                code: 'EMP_<50',
                label: '< 50'
            },
            {
                code: 'EMP_50_249',
                label: '50 – 249'
            },
            {
                code: 'EMP_250_499',
                label: '250 – 499'
            },
            {
                code: 'EMP_500+',
                label: '500+'
            }
        ]
    },
    {
        id: 'Q0.4',
        group: 'profile',
        text: 'Годовой оборот (EUR)',
        type: 'single',
        options: [
            {
                code: 'REV_<10M',
                label: '< 10 млн €'
            },
            {
                code: 'REV_10_40M',
                label: '10 – 40 млн €'
            },
            {
                code: 'REV_40_50M',
                label: '40 – 50 млн €'
            },
            {
                code: 'REV_>50M',
                label: '> 50 млн €'
            }
        ]
    },
    {
        id: 'Q0.5',
        group: 'profile',
        text: 'Компания публичная?',
        type: 'single',
        options: [
            {
                code: 'PUBLIC',
                label: 'Да, публичная (есть листинг)'
            },
            {
                code: 'PRIVATE',
                label: 'Нет, частная'
            }
        ]
    },
    {
        id: 'Q0.6',
        group: 'profile',
        text: 'Активы / AUM (для финсектора)',
        type: 'single',
        options: [
            {
                code: 'AUM_<500M',
                label: '< 500 млн €'
            },
            {
                code: 'AUM_500M_1B',
                label: '500 млн – 1 млрд €'
            },
            {
                code: 'AUM_>1B',
                label: '> 1 млрд €'
            }
        ]
    },
    {
        id: 'Q1.1',
        group: 'initiator',
        text: 'Кто инициировал запрос?',
        type: 'multi',
        options: [
            {
                code: 'REGULATOR',
                label: 'Регулятор / госорган'
            },
            {
                code: 'CLIENT_EXISTING',
                label: 'Текущий клиент'
            },
            {
                code: 'CLIENT_PROSPECT',
                label: 'Потенциальный клиент'
            },
            {
                code: 'BANK_INVESTOR',
                label: 'Банк / инвестор'
            },
            {
                code: 'PROGRAM',
                label: 'Программа / рейтинг (CDP, SBTi)'
            },
            {
                code: 'EXCHANGE',
                label: 'Биржа'
            },
            {
                code: 'INTERNAL_TOP',
                label: 'Руководство / совет директоров'
            },
            {
                code: 'INTERNAL_OTHER',
                label: 'Другая внутренняя инициатива'
            }
        ]
    },
    {
        id: 'Q2.1',
        group: 'regulator',
        text: 'Какой орган или юрисдикция предъявляет требования?',
        type: 'multi',
        options: [
            {
                code: 'EU',
                label: 'Европейский союз'
            },
            {
                code: 'UK',
                label: 'Великобритания'
            },
            {
                code: 'US',
                label: 'США'
            },
            {
                code: 'RU',
                label: 'Россия'
            },
            {
                code: 'OTHER_REG',
                label: 'Другая юрисдикция'
            }
        ]
    },
    {
        id: 'Q2.2',
        group: 'regulator',
        text: 'Какое требование ЕС применяется?',
        type: 'multi',
        options: [
            {
                code: 'CSRD',
                label: 'CSRD / ESRS'
            },
            {
                code: 'EU_ETS',
                label: 'EU ETS'
            },
            {
                code: 'CBAM',
                label: 'CBAM'
            },
            {
                code: 'EU_TAXONOMY',
                label: 'EU Taxonomy'
            },
            {
                code: 'SFDR',
                label: 'SFDR'
            },
            {
                code: 'OTHER_EU',
                label: 'Другое требование ЕС'
            }
        ]
    },
    {
        id: 'Q2.2a',
        group: 'regulator',
        text: 'Какие CBAM товары затронуты?',
        type: 'multi',
        options: [
            {
                code: 'STEEL',
                label: 'Сталь / железо'
            },
            {
                code: 'CEMENT',
                label: 'Цемент / клинкер'
            },
            {
                code: 'FERTILIZERS',
                label: 'Удобрения'
            },
            {
                code: 'ALUMINUM',
                label: 'Алюминий'
            },
            {
                code: 'HYDROGEN',
                label: 'Водород'
            },
            {
                code: 'ELECTRICITY',
                label: 'Электроэнергия'
            },
            {
                code: 'OTHER_CBAM',
                label: 'Другие товары CBAM'
            }
        ]
    },
    {
        id: 'Q2.3',
        group: 'regulator',
        text: 'Какое требование UK применяется?',
        type: 'multi',
        options: [
            {
                code: 'UK_SECR',
                label: 'SECR'
            },
            {
                code: 'UK_TCFD',
                label: 'TCFD (UK premium listing)'
            },
            {
                code: 'OTHER_UK',
                label: 'Другое UK требование'
            }
        ]
    },
    {
        id: 'Q2.4',
        group: 'regulator',
        text: 'Какое требование США применяется?',
        type: 'multi',
        options: [
            {
                code: 'SEC_CLIMATE',
                label: 'SEC Climate Disclosure'
            },
            {
                code: 'EPA_MRR',
                label: 'EPA MRR / GHG Reporting'
            },
            {
                code: 'CARB',
                label: 'CARB / штатные требования'
            },
            {
                code: 'OTHER_US',
                label: 'Другое US требование'
            }
        ]
    },
    {
        id: 'Q2.5',
        group: 'regulator',
        text: 'Какое требование РФ применяется?',
        type: 'multi',
        options: [
            {
                code: 'RU_GHG_MONITORING',
                label: 'Мониторинг ПГ (ФЗ 296)'
            },
            {
                code: 'SPPB',
                label: 'Субсидии / СППБ'
            },
            {
                code: 'OTHER_RU',
                label: 'Другое требование РФ'
            }
        ]
    },
    {
        id: 'Q3.1',
        group: 'client',
        text: 'Что просит клиент?',
        type: 'multi',
        options: [
            {
                code: 'COMPANY_INFO',
                label: 'Корпоративный след'
            },
            {
                code: 'PRODUCT_INFO',
                label: 'Продуктовый след'
            },
            {
                code: 'UPSTREAM',
                label: 'Upstream / цепочка поставок'
            },
            {
                code: 'TEMPLATE',
                label: 'Заполнить их шаблон'
            },
            {
                code: 'CERTIFICATE',
                label: 'Получить сертификат'
            },
            {
                code: 'SCOPE3_DETAIL',
                label: 'Детальный Scope 3'
            }
        ]
    },
    {
        id: 'Q3.2',
        group: 'client',
        text: 'Формат корпоративного запроса',
        type: 'single',
        options: [
            {
                code: 'ISO_14064',
                label: 'ISO 14064-1'
            },
            {
                code: 'CDP',
                label: 'CDP Disclosure'
            },
            {
                code: 'GHG_PROTOCOL',
                label: 'GHG Protocol'
            },
            {
                code: 'ECOVADIS',
                label: 'EcoVadis'
            },
            {
                code: 'CUSTOM',
                label: 'Их собственный формат'
            }
        ]
    },
    {
        id: 'Q3.3',
        group: 'client',
        text: 'Какой продукт или портфель нужно оценить?',
        type: 'free-text'
    },
    {
        id: 'Q3.3a',
        group: 'client',
        text: 'Нужна ли сертификация продукта?',
        type: 'single',
        options: [
            {
                code: 'CERT_REQUIRED',
                label: 'Да, нужен сертифицированный отчёт'
            },
            {
                code: 'CERT_NOT_REQUIRED',
                label: 'Нет, достаточно расчёта без серта'
            }
        ]
    },
    {
        id: 'Q3.4',
        group: 'client',
        text: 'Что входит в upstream-запрос клиента?',
        type: 'multi',
        options: [
            {
                code: 'PRODUCTION',
                label: 'Производство'
            },
            {
                code: 'PACKAGING',
                label: 'Упаковка'
            },
            {
                code: 'TRANSPORT',
                label: 'Транспорт / доставка'
            },
            {
                code: 'WAREHOUSING',
                label: 'Складская логистика'
            },
            {
                code: 'OTHER_UPSTREAM',
                label: 'Другое'
            }
        ]
    },
    {
        id: 'Q3.5',
        group: 'client',
        text: 'Какой сертификат требуется клиенту?',
        type: 'single',
        options: [
            {
                code: 'CARBON_NEUTRAL',
                label: 'Carbon Neutral / PAS 2060'
            },
            {
                code: 'ISO_14064',
                label: 'ISO 14064-1'
            },
            {
                code: 'ISO_14001',
                label: 'ISO 14001'
            },
            {
                code: 'EPD',
                label: 'EPD / ISO 14067'
            },
            {
                code: 'OTHER_CERT',
                label: 'Другой сертификат'
            }
        ]
    },
    {
        id: 'Q3.6',
        group: 'client',
        text: 'Какие категории Scope 3 нужны клиенту?',
        type: 'multi',
        options: [
            {
                code: 'PURCHASED_GOODS',
                label: 'Кат.1: Закупленные товары'
            },
            {
                code: 'CAPITAL_GOODS',
                label: 'Кат.2: Основные средства'
            },
            {
                code: 'FUEL_ENERGY',
                label: 'Кат.3: Топливо и энергия'
            },
            {
                code: 'UPSTREAM_TRANSPORT',
                label: 'Кат.4: Транспорт upstream'
            },
            {
                code: 'WASTE',
                label: 'Кат.5: Отходы операций'
            },
            {
                code: 'BUSINESS_TRAVEL',
                label: 'Кат.6: Командировки'
            },
            {
                code: 'COMMUTING',
                label: 'Кат.7: Дорога сотрудников'
            },
            {
                code: 'UPSTREAM_LEASED',
                label: 'Кат.8: Арендованные активы (upstream)'
            },
            {
                code: 'DOWNSTREAM_TRANSPORT',
                label: 'Кат.9: Транспорт downstream'
            },
            {
                code: 'PROCESSING',
                label: 'Кат.10: Переработка продукции'
            },
            {
                code: 'USE_PHASE',
                label: 'Кат.11: Использование продукции'
            },
            {
                code: 'END_OF_LIFE',
                label: 'Кат.12: Утилизация'
            },
            {
                code: 'DOWNSTREAM_LEASED',
                label: 'Кат.13: Арендованные активы (downstream)'
            },
            {
                code: 'FRANCHISES',
                label: 'Кат.14: Франшизы'
            },
            {
                code: 'INVESTMENTS',
                label: 'Кат.15: Инвестиции'
            }
        ]
    },
    {
        id: 'Q4.1',
        group: 'financial',
        text: 'Зачем информация банку или инвестору?',
        type: 'single',
        options: [
            {
                code: 'CREDIT',
                label: 'Кредитное решение'
            },
            {
                code: 'INVESTMENT',
                label: 'Инвестиции / доля'
            },
            {
                code: 'BOND',
                label: 'Выпуск облигаций'
            },
            {
                code: 'BANK_INTERNAL_REPORT',
                label: 'Для их собственного отчёта'
            }
        ]
    },
    {
        id: 'Q4.2',
        group: 'financial',
        text: 'Какой формат требует банк/инвестор?',
        type: 'multi',
        options: [
            {
                code: 'TCFD',
                label: 'TCFD отчёт'
            },
            {
                code: 'GHG_VERIFIED',
                label: 'Верифицированный GHG'
            },
            {
                code: 'CDP',
                label: 'CDP'
            },
            {
                code: 'ISO_14064',
                label: 'ISO 14064-1'
            },
            {
                code: 'BANK_TEMPLATE',
                label: 'Шаблон банка'
            }
        ]
    },
    {
        id: 'Q5.1',
        group: 'program',
        text: 'Какая программа или рейтинг?',
        type: 'multi',
        options: [
            {
                code: 'CDP',
                label: 'CDP'
            },
            {
                code: 'SBTI',
                label: 'Science Based Targets initiative'
            },
            {
                code: 'RE100',
                label: 'RE100'
            },
            {
                code: 'ECOVADIS',
                label: 'EcoVadis'
            },
            {
                code: 'GRESB',
                label: 'GRESB'
            },
            {
                code: 'BCORP',
                label: 'B Corp'
            },
            {
                code: 'OTHER_PROGRAM',
                label: 'Другая программа'
            }
        ]
    },
    {
        id: 'Q6.1',
        group: 'exchange',
        text: 'На какой бирже листинг или план листинга?',
        type: 'multi',
        options: [
            {
                code: 'EU_EXCHANGE',
                label: 'Биржа ЕС'
            },
            {
                code: 'LSE',
                label: 'London Stock Exchange'
            },
            {
                code: 'NYSE_NASDAQ',
                label: 'NYSE / NASDAQ'
            },
            {
                code: 'HKEX',
                label: 'Hong Kong Stock Exchange'
            },
            {
                code: 'OTHER_EXCHANGE',
                label: 'Другая биржа'
            }
        ]
    },
    {
        id: 'Q7.1',
        group: 'internal',
        text: 'Зачем компании расчёт выбросов?',
        type: 'multi',
        options: [
            {
                code: 'UNDERSTAND_FOOTPRINT',
                label: 'Понять текущий след'
            },
            {
                code: 'PREPARE_FOR_REGULATION',
                label: 'Подготовка к требованиям'
            },
            {
                code: 'SET_TARGETS',
                label: 'Постановка целей'
            },
            {
                code: 'REPUTATION',
                label: 'Репутация / PR'
            },
            {
                code: 'TENDERS',
                label: 'Участие в тендерах'
            },
            {
                code: 'ENERGY_EFFICIENCY',
                label: 'Энергоэффективность'
            }
        ]
    },
    {
        id: 'Q7.2',
        group: 'internal',
        text: 'Это первый расчёт выбросов?',
        type: 'single',
        options: [
            {
                code: 'FIRST_TIME_NO_VERIF',
                label: 'Да, первый раз без верификации'
            },
            {
                code: 'FIRST_TIME_WITH_VERIF',
                label: 'Да, первый раз с верификацией'
            },
            {
                code: 'ALREADY_DONE',
                label: 'Нет, выполняем ежегодно'
            }
        ]
    },
    {
        id: 'Q7.2a',
        group: 'internal',
        text: 'Нужна ли верификация первого расчёта?',
        type: 'single',
        options: [
            {
                code: 'VERIFICATION_REQUIRED',
                label: 'Да, нужна верификация'
            },
            {
                code: 'VERIFICATION_NOT_REQUIRED',
                label: 'Нет, пока не нужна'
            }
        ]
    },
    {
        id: 'Q7.3',
        group: 'internal',
        text: 'К какому будущему требованию готовитесь?',
        type: 'multi',
        options: [
            {
                code: 'CSRD',
                label: 'CSRD'
            },
            {
                code: 'SEC_CLIMATE',
                label: 'SEC Climate'
            },
            {
                code: 'SBTI',
                label: 'SBTi'
            },
            {
                code: 'CLIENT_SPECIFIC',
                label: 'Требование конкретного клиента'
            },
            {
                code: 'OTHER_FUTURE',
                label: 'Другое'
            }
        ]
    },
    {
        id: 'Q7.4',
        group: 'internal',
        text: 'Цели по выбросам будут публичными?',
        type: 'single',
        options: [
            {
                code: 'PUBLIC_TARGETS',
                label: 'Да, публично'
            },
            {
                code: 'INTERNAL_TARGETS',
                label: 'Нет, только внутренние цели'
            },
            {
                code: 'SBTI',
                label: 'Планируем SBTi'
            }
        ]
    },
    {
        id: 'Q7.5',
        group: 'internal',
        text: 'Что именно нужно для репутации?',
        type: 'multi',
        options: [
            {
                code: 'COMPANY_CERT',
                label: 'Сертификат для компании'
            },
            {
                code: 'COMPANY_PUBLICATION',
                label: 'Публичное раскрытие компании'
            },
            {
                code: 'PRODUCT_CERT',
                label: 'Сертификат продукта'
            },
            {
                code: 'PRODUCT_PUBLICATION',
                label: 'Публикация продукта'
            }
        ]
    },
    {
        id: 'Q7.5a',
        group: 'internal',
        text: 'К чему относится репутационный запрос?',
        type: 'single',
        options: [
            {
                code: 'COMPANY',
                label: 'Компания в целом'
            },
            {
                code: 'PRODUCT',
                label: 'Конкретный продукт'
            }
        ]
    },
    {
        id: 'Q7.6',
        group: 'internal',
        text: 'Что требуется для тендеров?',
        type: 'multi',
        options: [
            {
                code: 'CORPORATE_FOOTPRINT',
                label: 'Корпоративный след'
            },
            {
                code: 'PRODUCT_PCF',
                label: 'Продуктовый PCF'
            },
            {
                code: 'ISO_14064',
                label: 'ISO 14064'
            },
            {
                code: 'EPD',
                label: 'EPD / ISO 14067'
            },
            {
                code: 'REDUCTION_PLAN',
                label: 'План сокращения выбросов'
            },
            {
                code: 'RE_CERTIFICATES',
                label: 'Сертификаты ВИЭ / PPA'
            }
        ]
    },
    {
        id: 'Q8.1',
        group: 'operations',
        text: 'Какие собственные источники выбросов есть?',
        type: 'multi',
        options: [
            {
                code: 'STATIONARY_COMBUSTION',
                label: 'Стационарное сжигание'
            },
            {
                code: 'MOBILE_COMBUSTION',
                label: 'Транспорт / мобильные источники'
            },
            {
                code: 'FUGITIVE',
                label: 'Фугитивные выбросы'
            },
            {
                code: 'PROCESS_EMISSIONS',
                label: 'Процессные выбросы'
            },
            {
                code: 'AGRICULTURE',
                label: 'С/х источники'
            },
            {
                code: 'OTHER_SCOPE1',
                label: 'Другие Scope 1'
            }
        ]
    },
    {
        id: 'Q8.2',
        group: 'operations',
        text: 'Какую энергию покупаете?',
        type: 'multi',
        options: [
            {
                code: 'GRID_ELECTRICITY',
                label: 'Электроэнергия из сети'
            },
            {
                code: 'ON_SITE_RENEWABLE',
                label: 'Собственные ВИЭ'
            },
            {
                code: 'HEAT_STEAM',
                label: 'Тепло / пар'
            },
            {
                code: 'COGEN',
                label: 'Когенерация'
            },
            {
                code: 'PPA',
                label: 'PPA / закупка ВИЭ'
            }
        ]
    },
    {
        id: 'Q8.3',
        group: 'operations',
        text: 'Уровень покрытия Scope 3',
        type: 'single',
        options: [
            {
                code: 'SCOPE3_FULL',
                label: 'Полный Scope 3 (15 категорий)'
            },
            {
                code: 'SCOPE3_BASIC',
                label: 'Базовый Scope 3 (основные категории)'
            },
            {
                code: 'SCOPE1_2_ONLY',
                label: 'Только Scope 1-2'
            }
        ]
    },
    {
        id: 'Q9.1',
        group: 'trade',
        text: 'Есть ли экспорт в ЕС?',
        type: 'single',
        options: [
            {
                code: 'YES',
                label: 'Да, экспортируем'
            },
            {
                code: 'NO',
                label: 'Нет'
            },
            {
                code: 'PLANNED',
                label: 'Планируем в ближайшие 12 мес.'
            }
        ]
    },
    {
        id: 'Q9.2',
        group: 'trade',
        text: 'Какие товары экспортируются?',
        type: 'multi',
        options: [
            {
                code: 'CBAM_GOODS',
                label: 'Товары из списка CBAM'
            },
            {
                code: 'NON_CBAM_GOODS',
                label: 'Другие товары'
            }
        ]
    },
    {
        id: 'Q9.3',
        group: 'trade',
        text: 'Вы импортёр CBAM или поставщик данных?',
        type: 'single',
        options: [
            {
                code: 'SUPPLIER_ONLY',
                label: 'Поставщик данных для клиентов'
            },
            {
                code: 'IMPORTER_OF_RECORD',
                label: 'Импортёр, подающий отчётность'
            }
        ]
    },
    {
        id: 'Q10.1',
        group: 'constraints',
        text: 'Желаемый срок выполнения проекта',
        type: 'single',
        options: [
            {
                code: '<=2M',
                label: '≤ 2 месяцев'
            },
            {
                code: '3_6M',
                label: '3 – 6 месяцев'
            },
            {
                code: '>6M',
                label: '> 6 месяцев'
            }
        ]
    },
    {
        id: 'Q10.2',
        group: 'constraints',
        text: 'Есть ли внутренняя команда / данные?',
        type: 'single',
        options: [
            {
                code: 'NO_TEAM',
                label: 'Нет команды, данных мало'
            },
            {
                code: 'SOME_DATA',
                label: 'Есть часть данных'
            },
            {
                code: 'FULL_DATA',
                label: 'Полная команда и данные'
            }
        ]
    },
    {
        id: 'Q10.3',
        group: 'constraints',
        text: 'Бюджет на проект',
        type: 'single',
        options: [
            {
                code: 'LOW',
                label: 'Низкий'
            },
            {
                code: 'MEDIUM',
                label: 'Средний'
            },
            {
                code: 'HIGH',
                label: 'Высокий'
            }
        ]
    },
    {
        id: 'Q11.1',
        group: 'sector',
        text: 'Для авиации: есть международные рейсы?',
        type: 'single',
        options: [
            {
                code: 'DOMESTIC_ONLY',
                label: 'Только внутрироссийские / внутренние'
            },
            {
                code: 'INTERNATIONAL',
                label: 'Есть международные рейсы'
            }
        ]
    },
    {
        id: 'Q11.2',
        group: 'sector',
        text: 'Для морского флота: заходите в порты ЕС?',
        type: 'single',
        options: [
            {
                code: 'NO_EU_PORTS',
                label: 'Нет, только вне ЕС'
            },
            {
                code: 'EU_PORTS',
                label: 'Да, заходим в ЕС'
            }
        ]
    },
    {
        id: 'Q11.3',
        group: 'sector',
        text: 'Для финансов: какие продукты покрывает портфель?',
        type: 'multi',
        options: [
            {
                code: 'FUNDS',
                label: 'Фонды / управление активами'
            },
            {
                code: 'LOANS',
                label: 'Кредитование'
            },
            {
                code: 'ASSET_MANAGEMENT',
                label: 'Asset management / wealth'
            },
            {
                code: 'INSURANCE',
                label: 'Страхование'
            },
            {
                code: 'OTHER_FINANCE',
                label: 'Другое'
            }
        ]
    },
    {
        id: 'Q11.4',
        group: 'sector',
        text: 'Для строительства / недвижимости: какие сертификации целите?',
        type: 'multi',
        options: [
            {
                code: 'LEED',
                label: 'LEED'
            },
            {
                code: 'BREEAM',
                label: 'BREEAM'
            },
            {
                code: 'GRESB',
                label: 'GRESB'
            },
            {
                code: 'CRREM',
                label: 'CRREM'
            },
            {
                code: 'OTHER_BUILDING',
                label: 'Другие сертификации'
            }
        ]
    },
    {
        id: 'Q11.5',
        group: 'sector',
        text: 'Для IT / цифровой инфраструктуры: что используете?',
        type: 'multi',
        options: [
            {
                code: 'OWN_DATA_CENTERS',
                label: 'Собственные ЦОД'
            },
            {
                code: 'CLOUD_PROVIDERS',
                label: 'Публичные облака'
            },
            {
                code: 'EDGE_INFRA',
                label: 'Edge-инфраструктура'
            },
            {
                code: 'OTHER_IT',
                label: 'Другое'
            }
        ]
    }
];
const QUESTION_INDEX = Object.fromEntries(_c1 = QUESTION_DEFINITIONS.map(_c = (question)=>[
        question.id,
        question
    ]));
_c2 = QUESTION_INDEX;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QUESTION_INDEX$Object.fromEntries$QUESTION_DEFINITIONS.map");
__turbopack_context__.k.register(_c1, "QUESTION_INDEX$Object.fromEntries");
__turbopack_context__.k.register(_c2, "QUESTION_INDEX");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/reports.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REPORT_DEFINITIONS",
    ()=>REPORT_DEFINITIONS,
    "REPORT_IDS",
    ()=>REPORT_IDS
]);
const REPORT_DEFINITIONS = {
    CSRD: {
        id: 'CSRD',
        name: 'CSRD / ESRS отчётность',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Полное раскрытие по европейским стандартам ESRS (Scope 1-2-3).',
        notes: 'Применяется к крупным компаниям ЕС и листингам на биржах ЕС.',
        timelineMonths: [
            6,
            12
        ],
        budgetEUR: [
            50000,
            300000
        ]
    },
    EU_ETS: {
        id: 'EU_ETS',
        name: 'EU ETS отчёт',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'not_applicable',
            scope3: 'not_applicable'
        },
        frequency: 'ANNUAL',
        summary: 'Углеродная отчётность для установок, подпадающих под EU ETS.',
        notes: 'Штраф €100/т CO₂ за непокрытый объём.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            20000,
            80000
        ]
    },
    CBAM: {
        id: 'CBAM',
        name: 'CBAM отчётность (экспорт в ЕС)',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial',
            notes: 'предшествующие материалы'
        },
        frequency: 'QUARTERLY',
        summary: 'Квартальная отчётность по внедрённым выбросам и покупке сертификатов CBAM.',
        notes: 'Покупка сертификатов с 2026 года, штраф €10-50/т.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            20000,
            60000
        ]
    },
    UK_SECR: {
        id: 'UK_SECR',
        name: 'UK SECR',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Streamlined Energy and Carbon Reporting для UK компаний.',
        notes: 'Обязателен для крупных публичных компаний в UK.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            15000,
            50000
        ]
    },
    SEC_CLIMATE: {
        id: 'SEC_CLIMATE',
        name: 'SEC Climate Disclosure',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Климатическое раскрытие SEC для публичных компаний США.',
        notes: 'Scope 3 требуется, если материально (>40%).',
        timelineMonths: [
            4,
            8
        ],
        budgetEUR: [
            60000,
            180000
        ]
    },
    CORSIA: {
        id: 'CORSIA',
        name: 'CORSIA (ICAO)',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'not_applicable',
            scope3: 'not_applicable'
        },
        frequency: 'ANNUAL',
        summary: 'Мониторинг и отчётность по международным рейсам воздушных судов.',
        notes: 'Офсеты обязательны с 2027 года.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            30000,
            90000
        ]
    },
    EU_MRV: {
        id: 'EU_MRV',
        name: 'EU MRV (морской транспорт)',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'not_applicable',
            scope3: 'not_applicable'
        },
        frequency: 'ANNUAL',
        summary: 'Отчётность о выбросах судов >5000 GT в и из портов ЕС.',
        notes: 'С 2024 г. интегрируется в EU ETS.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            25000,
            80000
        ]
    },
    SFDR: {
        id: 'SFDR',
        name: 'SFDR (финансовый сектор)',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Раскрытие Principal Adverse Impacts и углеродного следа портфеля.',
        timelineMonths: [
            4,
            8
        ],
        budgetEUR: [
            40000,
            150000
        ]
    },
    UK_TCFD: {
        id: 'UK_TCFD',
        name: 'UK TCFD',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Климатическое раскрытие TCFD для листинга на LSE.',
        timelineMonths: [
            4,
            6
        ],
        budgetEUR: [
            30000,
            90000
        ]
    },
    HKEX_ESG: {
        id: 'HKEX_ESG',
        name: 'HKEX ESG Report',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Обязательное ESG-раскрытие для листингов HKEX.',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            25000,
            80000
        ]
    },
    ISO_14064_CERT: {
        id: 'ISO_14064_CERT',
        name: 'ISO 14064-1 сертификация',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Корпоративный инвентаризационный отчёт с внешней верификацией.',
        timelineMonths: [
            4,
            8
        ],
        budgetEUR: [
            20000,
            80000
        ]
    },
    CDP_DISCLOSURE: {
        id: 'CDP_DISCLOSURE',
        name: 'CDP Questionnaire',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Ответы на CDP Climate Change questionnaire.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            10000,
            40000
        ]
    },
    CORP_GHG: {
        id: 'CORP_GHG',
        name: 'Корпоративный GHG (GHG Protocol)',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Полный инвентарь выбросов Scope 1-2 и при необходимости Scope 3.',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            15000,
            60000
        ]
    },
    CORP_GHG_VERIFIED: {
        id: 'CORP_GHG_VERIFIED',
        name: 'Верифицированный корпоративный GHG',
        category: 'FINANCIAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Корпоративный GHG с независимой верификацией.',
        timelineMonths: [
            4,
            6
        ],
        budgetEUR: [
            25000,
            90000
        ]
    },
    CORP_GHG_SIMPLIFIED: {
        id: 'CORP_GHG_SIMPLIFIED',
        name: 'Упрощённый GHG',
        category: 'INTERNAL',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'not_applicable'
        },
        frequency: 'ANNUAL',
        summary: 'Базовый GHG расчёт без верификации для первого цикла.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            2000,
            10000
        ]
    },
    CORP_GHG_ANNUAL: {
        id: 'CORP_GHG_ANNUAL',
        name: 'Ежегодный GHG обновление',
        category: 'INTERNAL',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Поддержание инвентаризации для последующих лет.',
        timelineMonths: [
            1,
            3
        ],
        budgetEUR: [
            5000,
            20000
        ]
    },
    CORP_GHG_PUBLIC: {
        id: 'CORP_GHG_PUBLIC',
        name: 'Публичный корпоративный GHG',
        category: 'INTERNAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Раскрытие корпоративных выбросов с публичной публикацией.',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            20000,
            70000
        ]
    },
    CORP_GHG_INTERNAL: {
        id: 'CORP_GHG_INTERNAL',
        name: 'Внутренний GHG',
        category: 'INTERNAL',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Расчёт для внутренних целей и мониторинга.',
        timelineMonths: [
            2,
            3
        ],
        budgetEUR: [
            8000,
            25000
        ]
    },
    ECOVADIS_SCORE: {
        id: 'ECOVADIS_SCORE',
        name: 'EcoVadis Assessment',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'Подготовка данных и компиляция для оценки EcoVadis.',
        timelineMonths: [
            1,
            3
        ],
        budgetEUR: [
            5000,
            15000
        ]
    },
    EPD_OR_ISO_14067: {
        id: 'EPD_OR_ISO_14067',
        name: 'EPD / ISO 14067',
        category: 'PRODUCT',
        priorityLevel: 'HIGH',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ONE_OFF',
        summary: 'Полный LCA с внешней верификацией и публикацией.',
        timelineMonths: [
            6,
            12
        ],
        budgetEUR: [
            30000,
            120000
        ]
    },
    PRODUCT_PCF: {
        id: 'PRODUCT_PCF',
        name: 'Product Carbon Footprint',
        category: 'PRODUCT',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'partial',
            scope2: 'partial',
            scope3: 'required'
        },
        frequency: 'ONE_OFF',
        summary: 'Продуктовый GHG отчёт (cradle-to-gate/grave).',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            8000,
            40000
        ]
    },
    CLIENT_SCOPE3_PACKAGE: {
        id: 'CLIENT_SCOPE3_PACKAGE',
        name: 'Scope 3 пакет для клиента',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'optional',
            scope2: 'optional',
            scope3: 'required'
        },
        frequency: 'ON_DEMAND',
        summary: 'Расчёт требуемых участков Scope 3 для клиента.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            5000,
            20000
        ]
    },
    CLIENT_TEMPLATE_FILL: {
        id: 'CLIENT_TEMPLATE_FILL',
        name: 'Заполнение шаблона клиента',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'NOT_NEEDED',
        scopes: {
            scope1: 'optional',
            scope2: 'optional',
            scope3: 'optional'
        },
        frequency: 'ON_DEMAND',
        summary: 'Конвертация данных в формат клиента/поставщика.',
        timelineMonths: [
            0.5,
            1
        ],
        budgetEUR: [
            2000,
            8000
        ]
    },
    SCOPE3_DETAILED: {
        id: 'SCOPE3_DETAILED',
        name: 'Детальный Scope 3',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'optional',
            scope2: 'optional',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Моделирование всех выбранных категорий Scope 3.',
        timelineMonths: [
            2,
            4
        ],
        budgetEUR: [
            12000,
            45000
        ]
    },
    CARBON_NEUTRAL_CERT: {
        id: 'CARBON_NEUTRAL_CERT',
        name: 'Carbon Neutral / PAS 2060',
        category: 'CLIENT',
        priorityLevel: 'HIGH',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'GHG + офсеты для статуса Carbon Neutral.',
        timelineMonths: [
            3,
            5
        ],
        budgetEUR: [
            20000,
            70000
        ]
    },
    TCFD_REPORT: {
        id: 'TCFD_REPORT',
        name: 'TCFD отчёт',
        category: 'FINANCIAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Полное раскрытие по рекомендациям TCFD.',
        timelineMonths: [
            4,
            8
        ],
        budgetEUR: [
            30000,
            90000
        ]
    },
    BANK_TEMPLATE_FILL: {
        id: 'BANK_TEMPLATE_FILL',
        name: 'Заполнение шаблона банка/инвестора',
        category: 'FINANCIAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'NOT_NEEDED',
        scopes: {
            scope1: 'optional',
            scope2: 'optional',
            scope3: 'optional'
        },
        frequency: 'ON_DEMAND',
        summary: 'Подготовка данных в заданной форме банка.',
        timelineMonths: [
            0.5,
            1
        ],
        budgetEUR: [
            3000,
            10000
        ]
    },
    SCOPE123_DATASET: {
        id: 'SCOPE123_DATASET',
        name: 'Набор данных Scope 1-2-3',
        category: 'DATA',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ON_DEMAND',
        summary: 'Сборка сырых данных выбросов для передачи банку.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            5000,
            15000
        ]
    },
    SBTI_COMMITMENT: {
        id: 'SBTI_COMMITMENT',
        name: 'SBTi Commitment & Validation',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ONE_OFF',
        summary: 'Подготовка базовой линии и целей для SBTi.',
        timelineMonths: [
            4,
            6
        ],
        budgetEUR: [
            20000,
            70000
        ]
    },
    RE100_REPORTING: {
        id: 'RE100_REPORTING',
        name: 'RE100 отчётность',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'optional',
            scope2: 'required',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Отслеживание доли возобновляемой электроэнергии.',
        timelineMonths: [
            2,
            3
        ],
        budgetEUR: [
            8000,
            20000
        ]
    },
    GRESB_ASSESSMENT: {
        id: 'GRESB_ASSESSMENT',
        name: 'GRESB / CRREM оценка',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ANNUAL',
        summary: 'ESG рейтинг для портфеля недвижимости.',
        timelineMonths: [
            3,
            5
        ],
        budgetEUR: [
            15000,
            60000
        ]
    },
    BCORP_IMPACT_ASSESSMENT: {
        id: 'BCORP_IMPACT_ASSESSMENT',
        name: 'B Corp Impact Assessment',
        category: 'PROGRAM',
        priorityLevel: 'HIGH',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ONE_OFF',
        summary: 'Подготовка к сертификации B Corp.',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            12000,
            40000
        ]
    },
    PREP_GHG: {
        id: 'PREP_GHG',
        name: 'Подготовительный GHG под регулятора',
        category: 'INTERNAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'required'
        },
        frequency: 'ONE_OFF',
        summary: 'GHG в формате будущего регулирования (CSRD, SEC, и т.п.).',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            20000,
            80000
        ]
    },
    CLIMATE_ACTION_PLAN: {
        id: 'CLIMATE_ACTION_PLAN',
        name: 'Plan сокращения выбросов',
        category: 'INTERNAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ONE_OFF',
        summary: 'Roadmap по снижению выбросов на 5–10 лет.',
        timelineMonths: [
            2,
            3
        ],
        budgetEUR: [
            8000,
            30000
        ]
    },
    RECS_OR_PPA_STRATEGY: {
        id: 'RECS_OR_PPA_STRATEGY',
        name: 'Стратегия по ВИЭ (RECs / PPA)',
        category: 'INTERNAL',
        priorityLevel: 'HIGH',
        verificationLevel: 'NOT_NEEDED',
        scopes: {
            scope1: 'optional',
            scope2: 'required',
            scope3: 'not_applicable'
        },
        frequency: 'ONE_OFF',
        summary: 'План покупки сертификатов или заключения PPA.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            5000,
            20000
        ]
    },
    ENERGY_AUDIT_SCOPE12: {
        id: 'ENERGY_AUDIT_SCOPE12',
        name: 'Энергоаудит + Scope 1-2',
        category: 'INTERNAL',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'partial',
            scope2: 'required',
            scope3: 'not_applicable'
        },
        frequency: 'ONE_OFF',
        summary: 'Анализ энергопотребления и топлива для снижения выбросов.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            6000,
            20000
        ]
    },
    BUILDING_CARBON_FOOTPRINT: {
        id: 'BUILDING_CARBON_FOOTPRINT',
        name: 'Углеродный след здания',
        category: 'SECTOR',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'partial',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ONE_OFF',
        summary: 'Отчёт для сертификаций LEED/BREEAM (operational + embodied).',
        timelineMonths: [
            3,
            6
        ],
        budgetEUR: [
            15000,
            50000
        ]
    },
    SCOPE2_DETAILED: {
        id: 'SCOPE2_DETAILED',
        name: 'Детализированный Scope 2 для IT/ЦОД',
        category: 'SECTOR',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'not_applicable',
            scope2: 'required',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Учет электроэнергии с учётом PUE и источников.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            5000,
            15000
        ]
    },
    SCOPE3_CATEGORY1_SUPPLIERS: {
        id: 'SCOPE3_CATEGORY1_SUPPLIERS',
        name: 'Scope 3 Категория 1 (поставщики ИТ)',
        category: 'SECTOR',
        priorityLevel: 'MEDIUM',
        verificationLevel: 'OPTIONAL',
        scopes: {
            scope1: 'not_applicable',
            scope2: 'optional',
            scope3: 'required'
        },
        frequency: 'ANNUAL',
        summary: 'Сбор данных от облачных провайдеров / поставщиков.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            6000,
            20000
        ]
    },
    CBAM_DATA_PACKAGE: {
        id: 'CBAM_DATA_PACKAGE',
        name: 'CBAM data package для клиентов',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'QUARTERLY',
        summary: 'Передача данных об встроенных выбросах клиентам-импортёрам.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            10000,
            30000
        ]
    },
    CBAM_REPORT: {
        id: 'CBAM_REPORT',
        name: 'CBAM импортёрский отчёт',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'QUARTERLY',
        summary: 'Отчёт импортёра CBAM в реестре.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            20000,
            50000
        ]
    },
    CBAM_ALLOWANCES: {
        id: 'CBAM_ALLOWANCES',
        name: 'CBAM сертификаты',
        category: 'REGULATORY',
        priorityLevel: 'CRITICAL',
        verificationLevel: 'MANDATORY',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'QUARTERLY',
        summary: 'План покупки и погашения CBAM сертификатов.',
        timelineMonths: [
            1,
            1
        ],
        budgetEUR: [
            10000,
            40000
        ]
    },
    CBAM_MONITORING_ALERT: {
        id: 'CBAM_MONITORING_ALERT',
        name: 'CBAM мониторинг (наблюдение)',
        category: 'REGULATORY',
        priorityLevel: 'LOW',
        verificationLevel: 'NOT_NEEDED',
        scopes: {
            scope1: 'optional',
            scope2: 'optional',
            scope3: 'optional'
        },
        frequency: 'ANNUAL',
        summary: 'Подготовка системы учёта на случай расширения CBAM.',
        timelineMonths: [
            1,
            2
        ],
        budgetEUR: [
            3000,
            12000
        ]
    },
    CBAM_PREP_METHOD: {
        id: 'CBAM_PREP_METHOD',
        name: 'CBAM методология подготовки',
        category: 'REGULATORY',
        priorityLevel: 'HIGH',
        verificationLevel: 'RECOMMENDED',
        scopes: {
            scope1: 'required',
            scope2: 'required',
            scope3: 'partial'
        },
        frequency: 'ONE_OFF',
        summary: 'Настройка расчётов перед стартом экспорта под CBAM.',
        timelineMonths: [
            2,
            3
        ],
        budgetEUR: [
            8000,
            25000
        ]
    }
};
const REPORT_IDS = Object.keys(REPORT_DEFINITIONS);
_c = REPORT_IDS;
var _c;
__turbopack_context__.k.register(_c, "REPORT_IDS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RULES",
    ()=>RULES
]);
const CLIENT_INITIATORS = [
    'CLIENT_EXISTING',
    'CLIENT_PROSPECT'
];
const INTERNAL_INITIATORS = [
    'INTERNAL_TOP',
    'INTERNAL_OTHER'
];
const RULES = [
    // =============================
    // Регуляторные требования (#1–#11)
    // =============================
    {
        id: 'R1_CSRD_SIZE',
        source: '#1',
        description: 'CSRD для публичных компаний ЕС с численностью ≥250',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'EU'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.3',
                values: [
                    'EMP_250_499',
                    'EMP_500+'
                ]
            }
        ],
        outputs: {
            reports: [
                'CSRD'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R1_CSRD_REVENUE',
        source: '#1',
        description: 'CSRD для публичных компаний ЕС с оборотом ≥40 млн €',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'EU'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.4',
                values: [
                    'REV_40_50M',
                    'REV_>50M'
                ]
            }
        ],
        outputs: {
            reports: [
                'CSRD'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R1_CSRD_EXCHANGE',
        source: '#9',
        description: 'CSRD для компаний, листинговых на биржах ЕС',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q6.1',
                value: 'EU_EXCHANGE'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            }
        ],
        outputs: {
            reports: [
                'CSRD'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R2_EU_ETS',
        source: '#2',
        description: 'EU ETS для энергетики и производства в ЕС',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'EU'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.2',
                values: [
                    'ENERGY',
                    'MANUFACTURING'
                ]
            },
            {
                type: 'includes',
                questionId: 'Q2.2',
                value: 'EU_ETS'
            }
        ],
        outputs: {
            reports: [
                'EU_ETS'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R3_CBAM',
        source: '#3',
        description: 'CBAM при экспорте товаров из списка',
        conditions: [
            {
                type: 'anyOf',
                questionId: 'Q9.1',
                values: [
                    'YES',
                    'PLANNED'
                ]
            },
            {
                type: 'includes',
                questionId: 'Q9.2',
                value: 'CBAM_GOODS'
            }
        ],
        outputs: {
            reports: [
                'CBAM'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R4_UK_SECR',
        source: '#4',
        description: 'SECR для крупных публичных компаний UK',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'UK'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.3',
                values: [
                    'EMP_250_499',
                    'EMP_500+'
                ]
            }
        ],
        outputs: {
            reports: [
                'UK_SECR'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R5_SEC_CLIMATE',
        source: '#5',
        description: 'SEC Climate Disclosure для публичных компаний США',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'US'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            },
            {
                type: 'includes',
                questionId: 'Q6.1',
                value: 'NYSE_NASDAQ'
            }
        ],
        outputs: {
            reports: [
                'SEC_CLIMATE'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R6_CORSIA',
        source: '#6',
        description: 'CORSIA для международной авиации',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'AVIATION'
            },
            {
                type: 'equals',
                questionId: 'Q11.1',
                value: 'INTERNATIONAL'
            }
        ],
        outputs: {
            reports: [
                'CORSIA'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R7_EU_MRV',
        source: '#7',
        description: 'EU MRV для флота, заходящего в ЕС',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'MARITIME'
            },
            {
                type: 'equals',
                questionId: 'Q11.2',
                value: 'EU_PORTS'
            }
        ],
        outputs: {
            reports: [
                'EU_MRV'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R8_SFDR',
        source: '#8',
        description: 'SFDR для финансовых организаций ЕС',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'EU'
            },
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'FINANCE'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.6',
                values: [
                    'AUM_500M_1B',
                    'AUM_>1B'
                ]
            }
        ],
        outputs: {
            reports: [
                'SFDR'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R10_UK_TCFD_LISTING',
        source: '#10',
        description: 'UK TCFD при листинге на LSE',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q6.1',
                value: 'LSE'
            }
        ],
        outputs: {
            reports: [
                'UK_TCFD'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R10_UK_TCFD_REQUEST',
        source: '#10',
        description: 'UK TCFD если регулятор указал требование',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'UK'
            },
            {
                type: 'includes',
                questionId: 'Q2.3',
                value: 'UK_TCFD'
            }
        ],
        outputs: {
            reports: [
                'UK_TCFD'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R11_HKEX_ESG',
        source: '#11',
        description: 'HKEX ESG для публичных компаний',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q6.1',
                value: 'HKEX'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PUBLIC'
            }
        ],
        outputs: {
            reports: [
                'HKEX_ESG'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    // =============================
    // Клиентские требования (#12–#21)
    // =============================
    {
        id: 'R12_CLIENT_ISO14064',
        source: '#12',
        description: 'ISO 14064 по запросу клиента',
        conditions: [
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: CLIENT_INITIATORS
            },
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'COMPANY_INFO'
            },
            {
                type: 'equals',
                questionId: 'Q3.2',
                value: 'ISO_14064'
            }
        ],
        outputs: {
            reports: [
                'ISO_14064_CERT'
            ]
        }
    },
    {
        id: 'R13_CLIENT_CDP',
        source: '#13',
        description: 'CDP по запросу клиента',
        conditions: [
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: CLIENT_INITIATORS
            },
            {
                type: 'equals',
                questionId: 'Q3.2',
                value: 'CDP'
            }
        ],
        outputs: {
            reports: [
                'CDP_DISCLOSURE'
            ]
        }
    },
    {
        id: 'R14_CLIENT_CORP_GHG',
        source: '#14',
        description: 'Корпоративный GHG по GHG Protocol',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'COMPANY_INFO'
            },
            {
                type: 'equals',
                questionId: 'Q3.2',
                value: 'GHG_PROTOCOL'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG'
            ]
        }
    },
    {
        id: 'R15_CLIENT_ECOVADIS',
        source: '#15',
        description: 'EcoVadis по запросу клиента',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'COMPANY_INFO'
            },
            {
                type: 'equals',
                questionId: 'Q3.2',
                value: 'ECOVADIS'
            }
        ],
        outputs: {
            reports: [
                'ECOVADIS_SCORE'
            ]
        }
    },
    {
        id: 'R16_CLIENT_EPD',
        source: '#16',
        description: 'EPD/ISO 14067 для продукта',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'PRODUCT_INFO'
            },
            {
                type: 'equals',
                questionId: 'Q3.3a',
                value: 'CERT_REQUIRED'
            }
        ],
        outputs: {
            reports: [
                'EPD_OR_ISO_14067'
            ]
        }
    },
    {
        id: 'R17_CLIENT_PCF',
        source: '#17',
        description: 'Продуктовый PCF без сертификации',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'PRODUCT_INFO'
            },
            {
                type: 'equals',
                questionId: 'Q3.3a',
                value: 'CERT_NOT_REQUIRED'
            }
        ],
        outputs: {
            reports: [
                'PRODUCT_PCF'
            ]
        }
    },
    {
        id: 'R18_CLIENT_SCOPE3',
        source: '#18',
        description: 'Scope 3 пакет для клиента',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'UPSTREAM'
            }
        ],
        outputs: {
            reports: [
                'CLIENT_SCOPE3_PACKAGE'
            ]
        }
    },
    {
        id: 'R19_CLIENT_TEMPLATE',
        source: '#19',
        description: 'Заполнение клиентского шаблона',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'TEMPLATE'
            }
        ],
        outputs: {
            reports: [
                'CLIENT_TEMPLATE_FILL'
            ]
        }
    },
    {
        id: 'R20_CLIENT_SCOPE3_DETAIL',
        source: '#20',
        description: 'Детальный Scope 3 по категориям',
        conditions: [
            {
                type: 'hasAny',
                questionId: 'Q3.6'
            }
        ],
        outputs: {
            reports: [
                'SCOPE3_DETAILED'
            ]
        }
    },
    {
        id: 'R21_CLIENT_CARBON_NEUTRAL',
        source: '#21',
        description: 'Carbon Neutral / PAS 2060',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'CERTIFICATE'
            },
            {
                type: 'equals',
                questionId: 'Q3.5',
                value: 'CARBON_NEUTRAL'
            }
        ],
        outputs: {
            reports: [
                'CARBON_NEUTRAL_CERT'
            ]
        }
    },
    // =============================
    // Банки и инвесторы (#22–#28)
    // =============================
    {
        id: 'R22_BANK_TCFD',
        source: '#22',
        description: 'TCFD отчёт по требованию банка',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includes',
                questionId: 'Q4.2',
                value: 'TCFD'
            }
        ],
        outputs: {
            reports: [
                'TCFD_REPORT'
            ]
        }
    },
    {
        id: 'R23_BANK_GHG_VERIFIED',
        source: '#23',
        description: 'Верифицированный GHG при требовании банка',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includes',
                questionId: 'Q4.2',
                value: 'GHG_VERIFIED'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_VERIFIED'
            ]
        }
    },
    {
        id: 'R24_BANK_CDP',
        source: '#24',
        description: 'CDP от банка/инвестора',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includes',
                questionId: 'Q4.2',
                value: 'CDP'
            }
        ],
        outputs: {
            reports: [
                'CDP_DISCLOSURE'
            ]
        }
    },
    {
        id: 'R25_BANK_ISO',
        source: '#25',
        description: 'ISO 14064 по запросу банка',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includes',
                questionId: 'Q4.2',
                value: 'ISO_14064'
            }
        ],
        outputs: {
            reports: [
                'ISO_14064_CERT'
            ]
        }
    },
    {
        id: 'R26_BANK_TEMPLATE',
        source: '#26',
        description: 'Заполнение банковского шаблона',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includes',
                questionId: 'Q4.2',
                value: 'BANK_TEMPLATE'
            }
        ],
        outputs: {
            reports: [
                'BANK_TEMPLATE_FILL'
            ]
        }
    },
    {
        id: 'R27_BANK_DEFAULT_VERIFIED',
        source: '#27',
        description: 'Банк не указал формат — default верифицированный GHG',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'isEmpty',
                questionId: 'Q4.2'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_VERIFIED'
            ]
        }
    },
    {
        id: 'R28_BANK_DATA_ONLY',
        source: '#28',
        description: 'Банку нужны только данные Scope 1-2-3',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'equals',
                questionId: 'Q4.1',
                value: 'BANK_INTERNAL_REPORT'
            }
        ],
        outputs: {
            reports: [
                'SCOPE123_DATASET'
            ]
        }
    },
    // =============================
    // Программы и рейтинги (#29–#34)
    // =============================
    {
        id: 'R29_PROGRAM_CDP',
        source: '#29',
        description: 'CDP в рамках программы',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'CDP'
            }
        ],
        outputs: {
            reports: [
                'CDP_DISCLOSURE'
            ]
        }
    },
    {
        id: 'R30_PROGRAM_SBTI',
        source: '#30',
        description: 'SBTi обязательства',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'SBTI'
            }
        ],
        outputs: {
            reports: [
                'SBTI_COMMITMENT',
                'CORP_GHG'
            ]
        }
    },
    {
        id: 'R31_PROGRAM_RE100',
        source: '#31',
        description: 'RE100 отчётность',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'RE100'
            }
        ],
        outputs: {
            reports: [
                'RE100_REPORTING'
            ]
        }
    },
    {
        id: 'R32_PROGRAM_ECOVADIS',
        source: '#32',
        description: 'EcoVadis программа',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'ECOVADIS'
            }
        ],
        outputs: {
            reports: [
                'ECOVADIS_SCORE'
            ]
        }
    },
    {
        id: 'R33_PROGRAM_GRESB',
        source: '#33',
        description: 'GRESB / CRREM оценка',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'GRESB'
            }
        ],
        outputs: {
            reports: [
                'GRESB_ASSESSMENT'
            ]
        }
    },
    {
        id: 'R34_PROGRAM_BCORP',
        source: '#34',
        description: 'B Corp Impact Assessment',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'BCORP'
            }
        ],
        outputs: {
            reports: [
                'BCORP_IMPACT_ASSESSMENT'
            ]
        }
    },
    // =============================
    // Внутренние инициативы (#35–#53)
    // =============================
    {
        id: 'R35_INTERNAL_SIMPLE',
        source: '#35',
        description: 'Упрощённый GHG для первого расчёта без верификации',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'UNDERSTAND_FOOTPRINT'
            },
            {
                type: 'equals',
                questionId: 'Q7.2',
                value: 'FIRST_TIME_NO_VERIF'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_SIMPLIFIED'
            ]
        }
    },
    {
        id: 'R36_INTERNAL_FULL_VERIFIED',
        source: '#36',
        description: 'Полный GHG с верификацией при первом расчёте',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'UNDERSTAND_FOOTPRINT'
            },
            {
                type: 'equals',
                questionId: 'Q7.2',
                value: 'FIRST_TIME_WITH_VERIF'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_VERIFIED'
            ]
        }
    },
    {
        id: 'R37_INTERNAL_ANNUAL',
        source: '#37',
        description: 'Ежегодное обновление GHG',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q7.2',
                value: 'ALREADY_DONE'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_ANNUAL'
            ]
        }
    },
    {
        id: 'R38_INTERNAL_PREP',
        source: '#38',
        description: 'Подготовительный GHG к будущим требованиям',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'PREPARE_FOR_REGULATION'
            },
            {
                type: 'anyOf',
                questionId: 'Q7.3',
                values: [
                    'CSRD',
                    'SEC_CLIMATE',
                    'SBTI',
                    'CLIENT_SPECIFIC',
                    'OTHER_FUTURE'
                ]
            }
        ],
        outputs: {
            reports: [
                'PREP_GHG'
            ]
        }
    },
    {
        id: 'R39_INTERNAL_PUBLIC',
        source: '#39',
        description: 'Публичное раскрытие корпоративного GHG',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'SET_TARGETS'
            },
            {
                type: 'equals',
                questionId: 'Q7.4',
                value: 'PUBLIC_TARGETS'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_PUBLIC'
            ]
        }
    },
    {
        id: 'R40_INTERNAL_INTERNAL',
        source: '#40',
        description: 'Внутренние цели без публикации',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q7.4',
                value: 'INTERNAL_TARGETS'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_INTERNAL'
            ]
        }
    },
    {
        id: 'R41_INTERNAL_SBTI',
        source: '#41',
        description: 'SBTi из блока внутренних целей',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q7.4',
                value: 'SBTI'
            }
        ],
        outputs: {
            reports: [
                'SBTI_COMMITMENT',
                'CORP_GHG'
            ]
        }
    },
    {
        id: 'R42_INTERNAL_COMPANY_CERT',
        source: '#42',
        description: 'Сертификат для репутации компании',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.5',
                value: 'COMPANY_CERT'
            }
        ],
        outputs: {
            reports: [
                'ISO_14064_CERT',
                'CARBON_NEUTRAL_CERT'
            ]
        }
    },
    {
        id: 'R43_INTERNAL_COMPANY_PUBLIC',
        source: '#43',
        description: 'Публикация корпоративного следа для репутации',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.5',
                value: 'COMPANY_PUBLICATION'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_PUBLIC'
            ]
        }
    },
    {
        id: 'R44_INTERNAL_PRODUCT_CERT',
        source: '#44',
        description: 'Продуктовая сертификация для репутации',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.5',
                value: 'PRODUCT_CERT'
            }
        ],
        outputs: {
            reports: [
                'EPD_OR_ISO_14067'
            ]
        }
    },
    {
        id: 'R45_INTERNAL_PRODUCT_PCF',
        source: '#45',
        description: 'Публикация продуктового следа',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.5',
                value: 'PRODUCT_PUBLICATION'
            }
        ],
        outputs: {
            reports: [
                'PRODUCT_PCF'
            ]
        }
    },
    {
        id: 'R46_INTERNAL_TENDER_CORP',
        source: '#46',
        description: 'Корпоративный GHG для тендеров',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'TENDERS'
            },
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'CORPORATE_FOOTPRINT'
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG'
            ]
        }
    },
    {
        id: 'R47_INTERNAL_TENDER_PCF',
        source: '#47',
        description: 'Продуктовый PCF для тендера',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'PRODUCT_PCF'
            }
        ],
        outputs: {
            reports: [
                'PRODUCT_PCF'
            ]
        }
    },
    {
        id: 'R48_INTERNAL_TENDER_ISO',
        source: '#48',
        description: 'ISO 14064 для тендера',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'ISO_14064'
            }
        ],
        outputs: {
            reports: [
                'ISO_14064_CERT'
            ]
        }
    },
    {
        id: 'R49_INTERNAL_TENDER_EPD',
        source: '#49',
        description: 'EPD для тендера',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'EPD'
            }
        ],
        outputs: {
            reports: [
                'EPD_OR_ISO_14067'
            ]
        }
    },
    {
        id: 'R50_INTERNAL_TENDER_PLAN',
        source: '#50',
        description: 'План сокращения выбросов для тендера',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'REDUCTION_PLAN'
            }
        ],
        outputs: {
            reports: [
                'CLIMATE_ACTION_PLAN'
            ]
        }
    },
    {
        id: 'R51_INTERNAL_TENDER_RECS',
        source: '#51',
        description: 'Стратегия ВИЭ для тендеров',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.6',
                value: 'RE_CERTIFICATES'
            }
        ],
        outputs: {
            reports: [
                'RECS_OR_PPA_STRATEGY'
            ]
        }
    },
    {
        id: 'R52_INTERNAL_ENERGY_AUDIT',
        source: '#52',
        description: 'Энергоаудит',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q7.1',
                value: 'ENERGY_EFFICIENCY'
            }
        ],
        outputs: {
            reports: [
                'ENERGY_AUDIT_SCOPE12'
            ]
        }
    },
    {
        id: 'R53_INTERNAL_ROUTING',
        source: '#53',
        description: 'Прочие внутренние инициаторы подключают правила 35–52',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'INTERNAL_OTHER'
            }
        ],
        outputs: {
            notes: [
                'INTERNAL_FOLLOW_STANDARD_FLOW'
            ]
        }
    },
    // =============================
    // Отраслевая специфика (#54–#60)
    // =============================
    {
        id: 'R54_SECTOR_CORSIA_DUP',
        source: '#54',
        description: 'Подтверждение CORSIA из отраслевого блока',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'AVIATION'
            },
            {
                type: 'equals',
                questionId: 'Q11.1',
                value: 'INTERNATIONAL'
            }
        ],
        outputs: {
            reports: [
                'CORSIA'
            ]
        }
    },
    {
        id: 'R55_SECTOR_EU_MRV_DUP',
        source: '#55',
        description: 'Подтверждение EU MRV',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'MARITIME'
            },
            {
                type: 'equals',
                questionId: 'Q11.2',
                value: 'EU_PORTS'
            }
        ],
        outputs: {
            reports: [
                'EU_MRV'
            ]
        }
    },
    {
        id: 'R56_SECTOR_SFDR_DUP',
        source: '#56',
        description: 'SFDR из отраслевого блока',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'FINANCE'
            },
            {
                type: 'includes',
                questionId: 'Q11.3',
                value: 'FUNDS'
            }
        ],
        outputs: {
            reports: [
                'SFDR'
            ]
        }
    },
    {
        id: 'R57_SECTOR_BUILDING_CARBON',
        source: '#57',
        description: 'Углеродный след здания',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'CONSTRUCTION'
            },
            {
                type: 'includesAny',
                questionId: 'Q11.4',
                values: [
                    'LEED',
                    'BREEAM'
                ]
            }
        ],
        outputs: {
            reports: [
                'BUILDING_CARBON_FOOTPRINT'
            ]
        }
    },
    {
        id: 'R58_SECTOR_GRESB_CRREM',
        source: '#58',
        description: 'GRESB/CRREM для портфелей недвижимости',
        conditions: [
            {
                type: 'includesAny',
                questionId: 'Q11.4',
                values: [
                    'GRESB',
                    'CRREM'
                ]
            }
        ],
        outputs: {
            reports: [
                'GRESB_ASSESSMENT'
            ]
        }
    },
    {
        id: 'R59_SECTOR_IT_SCOPE2',
        source: '#59',
        description: 'Детальный Scope 2 для собственных ЦОД',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'IT'
            },
            {
                type: 'includes',
                questionId: 'Q11.5',
                value: 'OWN_DATA_CENTERS'
            }
        ],
        outputs: {
            reports: [
                'SCOPE2_DETAILED'
            ]
        }
    },
    {
        id: 'R60_SECTOR_IT_SCOPE3',
        source: '#60',
        description: 'Scope 3 Категория 1 для облаков',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.2',
                value: 'IT'
            },
            {
                type: 'includes',
                questionId: 'Q11.5',
                value: 'CLOUD_PROVIDERS'
            }
        ],
        outputs: {
            reports: [
                'SCOPE3_CATEGORY1_SUPPLIERS'
            ]
        }
    },
    // =============================
    // Комбинированные сценарии (#61–#64)
    // =============================
    {
        id: 'R61_COMBO_REG_CLIENT',
        source: '#61',
        description: 'Регулятор + клиент → регуляторные отчёты главные',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'REGULATOR'
            },
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: CLIENT_INITIATORS
            }
        ],
        outputs: {
            notes: [
                'PRIORITIZE_REGULATOR_OVER_CLIENT'
            ]
        }
    },
    {
        id: 'R62_COMBO_REG_INTERNAL',
        source: '#62',
        description: 'Регулятор + внутренняя инициатива',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'REGULATOR'
            },
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: INTERNAL_INITIATORS
            }
        ],
        outputs: {
            notes: [
                'INTERNAL_REPORTS_MARK_OPTIONAL'
            ]
        }
    },
    {
        id: 'R63_COMBO_CLIENT_BANK_INTERNAL',
        source: '#63',
        description: 'Клиент + банк + внутренние → объединить верифицированный GHG',
        conditions: [
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: CLIENT_INITIATORS
            },
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'BANK_INVESTOR'
            },
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: INTERNAL_INITIATORS
            }
        ],
        outputs: {
            reports: [
                'CORP_GHG_VERIFIED'
            ],
            notes: [
                'SHARED_DATASET_FOR_CLIENT_AND_BANK'
            ]
        }
    },
    {
        id: 'R64_COMBO_PROGRAM_INTERNAL',
        source: '#64',
        description: 'Программа + внутренние KPI',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q1.1',
                value: 'PROGRAM'
            },
            {
                type: 'includesAny',
                questionId: 'Q1.1',
                values: INTERNAL_INITIATORS
            }
        ],
        outputs: {
            notes: [
                'PROGRAM_IS_BASELINE_INTERNAL_IS_EXTENSION'
            ]
        }
    },
    // =============================
    // CBAM-специфика (#65–#68)
    // =============================
    {
        id: 'R65_CBAM_SUPPLIER_DATA',
        source: '#65',
        description: 'Экспортёр CBAM-товаров, передающий данные клиентам',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q9.1',
                value: 'YES'
            },
            {
                type: 'includes',
                questionId: 'Q9.2',
                value: 'CBAM_GOODS'
            },
            {
                type: 'equals',
                questionId: 'Q9.3',
                value: 'SUPPLIER_ONLY'
            }
        ],
        outputs: {
            reports: [
                'CBAM_DATA_PACKAGE'
            ]
        }
    },
    {
        id: 'R66_CBAM_IMPORTER',
        source: '#66',
        description: 'Импортёр CBAM с покупкой сертификатов',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q9.3',
                value: 'IMPORTER_OF_RECORD'
            }
        ],
        outputs: {
            reports: [
                'CBAM_REPORT',
                'CBAM_ALLOWANCES'
            ],
            tags: [
                'REGULATORY_MANDATORY'
            ]
        }
    },
    {
        id: 'R67_CBAM_MONITOR',
        source: '#67',
        description: 'Мониторинг CBAM для других товаров',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q9.2',
                value: 'NON_CBAM_GOODS'
            }
        ],
        outputs: {
            reports: [
                'CBAM_MONITORING_ALERT'
            ]
        }
    },
    {
        id: 'R68_CBAM_PREP',
        source: '#68',
        description: 'Подготовка к будущему экспорту CBAM-товаров',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q9.1',
                value: 'PLANNED'
            },
            {
                type: 'includes',
                questionId: 'Q9.2',
                value: 'CBAM_GOODS'
            }
        ],
        outputs: {
            reports: [
                'CBAM_PREP_METHOD'
            ]
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/validation-rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VALIDATION_RULES",
    ()=>VALIDATION_RULES
]);
const VALIDATION_RULES = [
    {
        id: 'V1_NO_CSRD_FOR_SMALL_PRIVATE',
        description: 'CSRD неприменима к малым частным компаниям',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q0.1',
                value: 'EU'
            },
            {
                type: 'equals',
                questionId: 'Q0.5',
                value: 'PRIVATE'
            },
            {
                type: 'anyOf',
                questionId: 'Q0.3',
                values: [
                    'EMP_<50',
                    'EMP_50_249'
                ]
            },
            {
                type: 'anyOf',
                questionId: 'Q0.4',
                values: [
                    'REV_<10M',
                    'REV_10_40M'
                ]
            }
        ],
        effects: [
            {
                type: 'forbid-report',
                reportId: 'CSRD'
            }
        ]
    },
    {
        id: 'V2_NO_CBAM_WITHOUT_EXPORT',
        description: 'CBAM не предлагаем, если экспорта в ЕС нет',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q9.1',
                value: 'NO'
            }
        ],
        effects: [
            {
                type: 'forbid-report',
                reportId: 'CBAM'
            },
            {
                type: 'forbid-report',
                reportId: 'CBAM_REPORT'
            },
            {
                type: 'forbid-report',
                reportId: 'CBAM_ALLOWANCES'
            },
            {
                type: 'forbid-report',
                reportId: 'CBAM_DATA_PACKAGE'
            },
            {
                type: 'forbid-report',
                reportId: 'CBAM_PREP_METHOD'
            }
        ]
    },
    {
        id: 'V3_NO_CORSIA_IF_NOT_AVIATION',
        description: 'CORSIA только для авиации',
        conditions: [
            {
                type: 'notEquals',
                questionId: 'Q0.2',
                value: 'AVIATION'
            },
            {
                type: 'reportSelected',
                reportId: 'CORSIA'
            }
        ],
        effects: [
            {
                type: 'forbid-report',
                reportId: 'CORSIA'
            }
        ]
    },
    {
        id: 'V4_UNREALISTIC_SCOPE3_IN_SHORT_TIME',
        description: 'Слишком короткие сроки для полной Scope 3 отчётности',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q10.1',
                value: '<=2M'
            },
            {
                type: 'anyReportSelected',
                reportIds: [
                    'CSRD',
                    'SBTI_COMMITMENT',
                    'CORP_GHG',
                    'CORP_GHG_VERIFIED',
                    'SCOPE3_DETAILED'
                ]
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'TIME_UNREALISTIC_FOR_FULL_SCOPE3',
                message: 'Полный Scope 3 обычно занимает >2 месяцев — проверьте сроки.'
            }
        ]
    },
    {
        id: 'V5_LOW_BUDGET_VS_EXPENSIVE_CERTS',
        description: 'Низкий бюджет не покрывает дорогие сертификации',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q10.3',
                value: 'LOW'
            },
            {
                type: 'anyReportSelected',
                reportIds: [
                    'ISO_14064_CERT',
                    'EPD_OR_ISO_14067',
                    'CSRD'
                ]
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'BUDGET_TOO_LOW_FOR_CERTIFICATION',
                message: 'Выбранные сертификации потребуют большего бюджета.'
            }
        ]
    },
    {
        id: 'V6_PRODUCT_ONLY_AVOIDS_CORP',
        description: 'Если клиент просит только продукт, корпоративный отчёт опционален',
        conditions: [
            {
                type: 'includes',
                questionId: 'Q3.1',
                value: 'PRODUCT_INFO'
            },
            {
                type: 'excludes',
                questionId: 'Q3.1',
                value: 'COMPANY_INFO'
            },
            {
                type: 'reportSelected',
                reportId: 'CORP_GHG'
            }
        ],
        effects: [
            {
                type: 'downgrade-priority',
                reportId: 'CORP_GHG',
                to: 'MEDIUM'
            }
        ]
    },
    {
        id: 'V7_SCOPE3_REQUIRED_FOR_SBTI',
        description: 'SBTi требует полного Scope 3',
        conditions: [
            {
                type: 'reportSelected',
                reportId: 'SBTI_COMMITMENT'
            },
            {
                type: 'notEquals',
                questionId: 'Q8.3',
                value: 'SCOPE3_FULL'
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'SCOPE3_REQUIRED_FOR_SBTI',
                message: 'Для SBTi нужен полный Scope 3 — обновите границы учёта.'
            }
        ]
    },
    {
        id: 'V8_SCOPE3_DATA_NEEDED',
        description: 'Отчёт требует Scope 3, но компания его не считает',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q8.3',
                value: 'SCOPE1_2_ONLY'
            },
            {
                type: 'anyReportSelected',
                reportIds: [
                    'CSRD',
                    'SBTI_COMMITMENT',
                    'SCOPE3_DETAILED',
                    'CLIENT_SCOPE3_PACKAGE',
                    'PRODUCT_PCF'
                ]
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'SCOPE3_DATA_NEEDED',
                message: 'Выбранные отчёты потребуют данных Scope 3.'
            }
        ]
    },
    {
        id: 'V9_DUPLICATE_CDP_SOURCES',
        description: 'CDP запрошен и клиентом, и программой',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q3.2',
                value: 'CDP'
            },
            {
                type: 'includes',
                questionId: 'Q5.1',
                value: 'CDP'
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'CDP_DUPLICATE_SOURCE',
                message: 'CDP требуется сразу несколькими инициаторами — можно объединить работу.'
            }
        ]
    },
    {
        id: 'V12_VERIFICATION_REQUIRED_BUT_REFUSED',
        description: 'Когда отчёты требуют верификации, но ответили что она не нужна',
        conditions: [
            {
                type: 'equals',
                questionId: 'Q7.2a',
                value: 'VERIFICATION_NOT_REQUIRED'
            },
            {
                type: 'anyReportSelected',
                reportIds: [
                    'CSRD',
                    'CBAM',
                    'ISO_14064_CERT',
                    'EPD_OR_ISO_14067',
                    'CORP_GHG_VERIFIED'
                ]
            }
        ],
        effects: [
            {
                type: 'add-warning',
                warningCode: 'VERIFICATION_MANDATORY',
                message: 'Некоторые выбранные отчёты требуют обязательной верификации.'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UNKNOWN_ANSWER_CODE",
    ()=>UNKNOWN_ANSWER_CODE,
    "UNKNOWN_ANSWER_DESCRIPTION",
    ()=>UNKNOWN_ANSWER_DESCRIPTION,
    "UNKNOWN_ANSWER_LABEL",
    ()=>UNKNOWN_ANSWER_LABEL
]);
const UNKNOWN_ANSWER_CODE = 'UNKNOWN';
const UNKNOWN_ANSWER_LABEL = 'Не знаю / нет данных';
const UNKNOWN_ANSWER_DESCRIPTION = 'Отметьте, если пока нет данных по этому вопросу';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/answer-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasMeaningfulAnswer",
    ()=>hasMeaningfulAnswer,
    "sanitizeMultiSelectAnswer",
    ()=>sanitizeMultiSelectAnswer,
    "sanitizeSingleSelectAnswer",
    ()=>sanitizeSingleSelectAnswer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/constants.ts [app-client] (ecmascript)");
;
function sanitizeSingleSelectAnswer(value) {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]) {
        return null;
    }
    return trimmed;
}
function sanitizeMultiSelectAnswer(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((item)=>typeof item === 'string' && item.length > 0).map((item)=>item.trim()).filter((item)=>item.length > 0 && item !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]);
}
function hasMeaningfulAnswer(value) {
    if (Array.isArray(value)) {
        return sanitizeMultiSelectAnswer(value).length > 0;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 && trimmed !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"];
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateQuestionnaire",
    ()=>evaluateQuestionnaire
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/questions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$reports$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/reports.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$validation$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/validation-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/answer-utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const PRIORITY_BASE = {
    CRITICAL: 100,
    HIGH: 70,
    MEDIUM: 45,
    LOW: 20
};
const CATEGORY_BONUS = {
    REGULATORY: 10,
    CLIENT: 6,
    FINANCIAL: 6,
    PROGRAM: 4,
    INTERNAL: 2,
    PRODUCT: 5,
    SECTOR: 3,
    DATA: 2
};
const CLIENT_CODES = new Set([
    'CLIENT_EXISTING',
    'CLIENT_PROSPECT'
]);
const INTERNAL_CODES = new Set([
    'INTERNAL_TOP',
    'INTERNAL_OTHER'
]);
function evaluateQuestionnaire(rawAnswers) {
    const answers = normalizeAnswers(rawAnswers);
    const selection = new Map();
    const globalNotes = new Set();
    // Step 1: apply rules
    for (const rule of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RULES"]){
        const currentSelected = new Set(selection.keys());
        if (!evaluateConditions(rule.conditions, answers, currentSelected)) continue;
        if (rule.outputs.reports && rule.outputs.reports.length > 0) {
            for (const reportId of rule.outputs.reports){
                var _rule_outputs_notes, _rule_outputs_tags;
                if (!reportId) continue;
                var _selection_get;
                const entry = (_selection_get = selection.get(reportId)) !== null && _selection_get !== void 0 ? _selection_get : {
                    sourceRules: new Set(),
                    notes: new Set(),
                    tags: new Set()
                };
                entry.sourceRules.add(rule.id);
                (_rule_outputs_notes = rule.outputs.notes) === null || _rule_outputs_notes === void 0 ? void 0 : _rule_outputs_notes.forEach((note)=>entry.notes.add(note));
                (_rule_outputs_tags = rule.outputs.tags) === null || _rule_outputs_tags === void 0 ? void 0 : _rule_outputs_tags.forEach((tag)=>entry.tags.add(tag));
                if (rule.outputs.priorityOverride) {
                    entry.priorityOverride = rule.outputs.priorityOverride;
                }
                selection.set(reportId, entry);
            }
        } else if (rule.outputs.notes) {
            rule.outputs.notes.forEach((note)=>globalNotes.add(note));
        }
    }
    const selectedSet = new Set(selection.keys());
    const warnings = [];
    const forbidden = new Set();
    const downgraded = new Map();
    // Step 2: validations
    for (const validation of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$validation$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VALIDATION_RULES"]){
        if (!evaluateConditions(validation.conditions, answers, selectedSet)) continue;
        for (const effect of validation.effects){
            switch(effect.type){
                case 'forbid-report':
                    forbidden.add(effect.reportId);
                    break;
                case 'downgrade-priority':
                    var _effect_to;
                    downgraded.set(effect.reportId, (_effect_to = effect.to) !== null && _effect_to !== void 0 ? _effect_to : 'AUTO');
                    break;
                case 'add-warning':
                    var _effect_message;
                    warnings.push({
                        code: effect.warningCode,
                        message: (_effect_message = effect.message) !== null && _effect_message !== void 0 ? _effect_message : effect.warningCode
                    });
                    break;
                default:
                    break;
            }
        }
    }
    const suppressedReports = [];
    for (const reportId of forbidden){
        if (selection.has(reportId)) {
            suppressedReports.push(reportId);
            selection.delete(reportId);
            selectedSet.delete(reportId);
        }
    }
    // Step 3: resolve reports
    const resolved = [];
    const initiators = new Set(getAnswerArray('Q1.1', answers));
    for (const [reportId, meta] of selection){
        const definition = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$reports$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPORT_DEFINITIONS"][reportId];
        if (!definition) continue;
        var _meta_priorityOverride;
        let priorityLevel = (_meta_priorityOverride = meta.priorityOverride) !== null && _meta_priorityOverride !== void 0 ? _meta_priorityOverride : definition.priorityLevel;
        if (downgraded.has(reportId)) {
            const target = downgraded.get(reportId);
            priorityLevel = target === 'AUTO' ? downgradePriorityLevel(priorityLevel) : target !== null && target !== void 0 ? target : priorityLevel;
        }
        const priorityScore = computePriorityScore({
            reportId,
            definition,
            priorityLevel,
            initiators,
            warningCount: warnings.length,
            globalNotes
        });
        resolved.push({
            id: reportId,
            definition,
            priorityLevel,
            sourceRules: Array.from(meta.sourceRules),
            notes: meta.notes.size ? Array.from(meta.notes) : undefined,
            tags: meta.tags.size ? Array.from(meta.tags) : undefined,
            priorityScore
        });
    }
    // Step 4: sort and group
    resolved.sort((a, b)=>{
        if (b.priorityScore !== a.priorityScore) {
            return b.priorityScore - a.priorityScore;
        }
        if (b.priorityLevel !== a.priorityLevel) {
            return priorityRank(b.priorityLevel) - priorityRank(a.priorityLevel);
        }
        if (a.definition.category !== b.definition.category) {
            return categoryRank(b.definition.category) - categoryRank(a.definition.category);
        }
        return a.definition.name.localeCompare(b.definition.name);
    });
    const mandatoryReports = resolved.filter((report)=>report.priorityLevel === 'CRITICAL' && report.definition.category === 'REGULATORY');
    const recommendedReports = resolved.filter((report)=>!mandatoryReports.includes(report) && (report.priorityLevel === 'CRITICAL' || report.priorityLevel === 'HIGH'));
    const optionalReports = resolved.filter((report)=>!mandatoryReports.includes(report) && !recommendedReports.includes(report));
    return {
        mandatoryReports,
        recommendedReports,
        optionalReports,
        warnings,
        suppressedReports,
        engineNotes: globalNotes.size ? Array.from(globalNotes) : undefined
    };
}
// =============================
// Helpers
// =============================
function normalizeAnswers(raw) {
    const normalized = {};
    const validIds = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_DEFINITIONS"].map((q)=>q.id));
    for (const key of Object.keys(raw)){
        const value = raw[key];
        if (value === undefined || value === null) continue;
        const question = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_INDEX"][key];
        if (!question) {
            normalized[key] = Array.isArray(value) ? value.filter((item)=>item !== undefined && item !== null).map((item)=>String(item)) : String(value);
            continue;
        }
        if (question.type === 'multi') {
            const arr = Array.isArray(value) ? value : [
                value
            ];
            const prepared = arr.filter((item)=>item !== undefined && item !== null).map((item)=>String(item));
            normalized[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeMultiSelectAnswer"])(prepared);
        } else if (question.type === 'free-text') {
            const scalar = Array.isArray(value) ? value[0] : value;
            if (scalar !== undefined && scalar !== null) {
                const text = String(scalar).trim();
                if (text.length > 0) {
                    normalized[key] = text;
                }
            }
        } else {
            const scalar = Array.isArray(value) ? value[0] : value;
            if (scalar !== undefined && scalar !== null) {
                const single = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeSingleSelectAnswer"])(String(scalar));
                if (single) {
                    normalized[key] = single;
                }
            }
        }
    }
    // Ensure keys exist even if not answered for easier checks
    for (const id of validIds){
        if (!(id in normalized)) {
            normalized[id] = null;
        }
    }
    return normalized;
}
function evaluateConditions(predicates, answers, selectedReports) {
    return predicates.every((predicate)=>evaluatePredicate(predicate, answers, selectedReports));
}
function evaluatePredicate(predicate, answers, selectedReports) {
    switch(predicate.type){
        case 'equals':
            {
                const answer = answers[predicate.questionId];
                if (Array.isArray(answer)) {
                    return answer.length === 1 && answer[0] === predicate.value;
                }
                return answer === predicate.value;
            }
        case 'notEquals':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                if (arr.length === 0) return true;
                return !arr.includes(predicate.value);
            }
        case 'anyOf':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return arr.some((value)=>predicate.values.includes(value));
            }
        case 'includes':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return arr.includes(predicate.value);
            }
        case 'includesAny':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return arr.some((value)=>predicate.values.includes(value));
            }
        case 'excludes':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return !arr.includes(predicate.value);
            }
        case 'allOf':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return predicate.values.every((value)=>arr.includes(value));
            }
        case 'hasAny':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return arr.length > 0;
            }
        case 'isEmpty':
            {
                const arr = getAnswerArray(predicate.questionId, answers);
                return arr.length === 0;
            }
        case 'flag':
            return false;
        case 'reportSelected':
            return selectedReports.has(predicate.reportId);
        case 'anyReportSelected':
            return predicate.reportIds.some((reportId)=>selectedReports.has(reportId));
        default:
            return true;
    }
}
function getAnswerArray(questionId, answers) {
    const value = answers[questionId];
    if (value === null || value === undefined) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.filter((item)=>typeof item === 'string');
    }
    if (typeof value === 'string' && value.length > 0) {
        return [
            value
        ];
    }
    return [];
}
function downgradePriorityLevel(current) {
    switch(current){
        case 'CRITICAL':
            return 'HIGH';
        case 'HIGH':
            return 'MEDIUM';
        case 'MEDIUM':
            return 'LOW';
        default:
            return 'LOW';
    }
}
function priorityRank(level) {
    switch(level){
        case 'CRITICAL':
            return 3;
        case 'HIGH':
            return 2;
        case 'MEDIUM':
            return 1;
        default:
            return 0;
    }
}
function categoryRank(category) {
    switch(category){
        case 'REGULATORY':
            return 4;
        case 'CLIENT':
            return 3;
        case 'FINANCIAL':
            return 3;
        case 'PROGRAM':
            return 2;
        case 'PRODUCT':
            return 2;
        case 'SECTOR':
            return 1;
        case 'INTERNAL':
            return 1;
        default:
            return 0;
    }
}
function computePriorityScore(input) {
    const { definition, priorityLevel, initiators, warningCount, globalNotes } = input;
    var _PRIORITY_BASE_priorityLevel;
    let score = (_PRIORITY_BASE_priorityLevel = PRIORITY_BASE[priorityLevel]) !== null && _PRIORITY_BASE_priorityLevel !== void 0 ? _PRIORITY_BASE_priorityLevel : 30;
    var _CATEGORY_BONUS_definition_category;
    score += (_CATEGORY_BONUS_definition_category = CATEGORY_BONUS[definition.category]) !== null && _CATEGORY_BONUS_definition_category !== void 0 ? _CATEGORY_BONUS_definition_category : 0;
    if (definition.category === 'REGULATORY' && initiators.has('REGULATOR')) {
        score += 10;
    }
    if (definition.category === 'REGULATORY' && initiators.has('EXCHANGE')) {
        score += 4;
    }
    if (definition.category === 'CLIENT' && hasClientInitiator(initiators)) {
        score += 6;
    }
    if (definition.category === 'FINANCIAL' && initiators.has('BANK_INVESTOR')) {
        score += 6;
    }
    if (definition.category === 'PROGRAM' && initiators.has('PROGRAM')) {
        score += 4;
    }
    if (definition.category === 'INTERNAL' && hasInternalInitiator(initiators)) {
        score += 3;
    }
    if (globalNotes.has('PRIORITIZE_REGULATOR_OVER_CLIENT') && definition.category !== 'REGULATORY') {
        score -= 5;
    }
    if (globalNotes.has('INTERNAL_REPORTS_MARK_OPTIONAL') && definition.category === 'INTERNAL') {
        score -= 8;
    }
    if (globalNotes.has('PROGRAM_IS_BASELINE_INTERNAL_IS_EXTENSION') && definition.category === 'INTERNAL') {
        score -= 4;
    }
    score -= warningCount * 2;
    return score;
}
function hasClientInitiator(initiators) {
    for (const code of initiators){
        if (CLIENT_CODES.has(code)) return true;
    }
    return false;
}
function hasInternalInitiator(initiators) {
    for (const code of initiators){
        if (INTERNAL_CODES.has(code)) return true;
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/block-visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeGroupVisibility",
    ()=>computeGroupVisibility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/answer-utils.ts [app-client] (ecmascript)");
;
const OPERATIONS_DRIVERS = new Set([
    'REGULATOR',
    'CLIENT_EXISTING',
    'CLIENT_PROSPECT',
    'BANK_INVESTOR',
    'PROGRAM',
    'INTERNAL_TOP',
    'INTERNAL_OTHER'
]);
const CLIENT_DRIVERS = new Set([
    'CLIENT_EXISTING',
    'CLIENT_PROSPECT'
]);
const INTERNAL_DRIVERS = new Set([
    'INTERNAL_TOP',
    'INTERNAL_OTHER'
]);
const TRADE_REGIONS = new Set([
    'EU',
    'UK',
    'US'
]);
const SECTOR_SPECIFIC_CODES = new Set([
    'AVIATION',
    'MARITIME',
    'FINANCE',
    'CONSTRUCTION',
    'IT'
]);
function computeGroupVisibility(answers) {
    const initiators = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeMultiSelectAnswer"])(answers['Q1.1']));
    const country = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeSingleSelectAnswer"])(answers['Q0.1']);
    const sector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeSingleSelectAnswer"])(answers['Q0.2']);
    const regulatorSelected = initiators.has('REGULATOR');
    const exchangeSelected = initiators.has('EXCHANGE');
    const clientSelected = intersects(initiators, CLIENT_DRIVERS);
    const financialSelected = initiators.has('BANK_INVESTOR');
    const programSelected = initiators.has('PROGRAM');
    const internalSelected = intersects(initiators, INTERNAL_DRIVERS);
    const operationsEnabled = intersects(initiators, OPERATIONS_DRIVERS);
    const regulatorInTradeRegion = regulatorSelected && !!country && TRADE_REGIONS.has(country);
    const tradeAnswersExist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasMeaningfulAnswer"])(answers['Q9.1']) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasMeaningfulAnswer"])(answers['Q9.2']) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasMeaningfulAnswer"])(answers['Q9.3']);
    return {
        profile: true,
        initiator: true,
        regulator: regulatorSelected || exchangeSelected,
        client: clientSelected,
        financial: financialSelected,
        program: programSelected,
        exchange: exchangeSelected,
        internal: internalSelected,
        operations: operationsEnabled,
        trade: operationsEnabled && regulatorInTradeRegion || tradeAnswersExist,
        constraints: true,
        sector: !!sector && SECTOR_SPECIFIC_CODES.has(sector)
    };
}
function intersects(source, targets) {
    for (const value of targets){
        if (source.has(value)) return true;
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questionnaires/decision-engine/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/questions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$reports$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/reports.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/answer-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$block$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/block-visibility.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/projects/new/questionnaire/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuestionnairePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layouts/dashboard-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$stepper$2f$title$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/stepper/title-status.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/radio-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wizard$2d$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/wizard-progress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/questions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$block$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/block-visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questionnaires/decision-engine/answer-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
const QUESTION_GROUP_TITLES = {
    profile: {
        title: 'Профиль компании',
        description: 'Базовые сведения о юрисдикции и размерах'
    },
    initiator: {
        title: 'Кто запросил отчёт',
        description: 'Понимаем мотивацию и обязательность'
    },
    regulator: {
        title: 'Регуляторные требования',
        description: 'Конкретизируем применимые режимы'
    },
    client: {
        title: 'Запросы клиентов',
        description: 'Какие форматы требуют контрагенты'
    },
    financial: {
        title: 'Финансовые запросы',
        description: 'Инвесторы, банки и фонды'
    },
    program: {
        title: 'Программы и рейтинги',
        description: 'CDP, SBTi и другие инициативы'
    },
    exchange: {
        title: 'Биржевые требования',
        description: 'Публичные листинги и раскрытия'
    },
    internal: {
        title: 'Внутренние инициативы',
        description: 'Совет директоров, топ-менеджмент'
    },
    operations: {
        title: 'Операционная деятельность',
        description: 'Границы учёта и процессы'
    },
    trade: {
        title: 'Экспорт и CBAM',
        description: 'Торговые операции с ЕС'
    },
    constraints: {
        title: 'Ограничения по срокам и бюджету',
        description: 'Реалистичность внедрения'
    },
    sector: {
        title: 'Отраслевые особенности',
        description: 'Детализируем контекст бизнеса'
    }
};
const QUESTION_GROUP_ORDER = [
    'profile',
    'initiator',
    'regulator',
    'client',
    'financial',
    'program',
    'exchange',
    'internal',
    'operations',
    'trade',
    'constraints',
    'sector'
];
const WIZARD_ACTIVE_STEP_KEY = 'wizardActiveStepIndex';
const STEP_DEFINITIONS = [
    {
        id: 'company-profile',
        title: 'Профиль компании',
        description: 'Базовые сведения перед выбором драйверов',
        groups: [
            'profile'
        ]
    },
    {
        id: 'drivers',
        title: 'Внешние драйверы',
        description: 'Инициаторы, регуляторы и клиенты',
        groups: [
            'initiator',
            'regulator',
            'client',
            'financial',
            'program',
            'exchange'
        ]
    },
    {
        id: 'internal',
        title: 'Внутренний контекст',
        description: 'Внутренние инициативы и границы расчёта',
        groups: [
            'internal',
            'operations'
        ]
    },
    {
        id: 'execution',
        title: 'Экспорт и ограничения',
        description: 'Торговые цепочки, сроки и ресурсы',
        groups: [
            'trade',
            'constraints'
        ]
    },
    {
        id: 'sector',
        title: 'Отраслевые детали',
        description: 'Специфические вопросы для отрасли',
        groups: [
            'sector'
        ]
    }
];
const ENGINE_TO_TEMPLATE_MAP = {
    CBAM: 'CBAM',
    CBAM_REPORT: 'CBAM',
    CBAM_ALLOWANCES: 'CBAM',
    CBAM_DATA_PACKAGE: 'CBAM',
    CBAM_PREP_METHOD: 'CBAM',
    ISO_14067_CERT: 'ISO14067',
    PRODUCT_PCF: 'ISO14067',
    LCA_PRODUCT: 'ISO14067'
};
const ACTION_BAR_HEIGHT = 112;
const ACTION_BAR_GAP = 24;
const CONTENT_BOTTOM_PADDING = ACTION_BAR_HEIGHT + ACTION_BAR_GAP;
function QuestionnairePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$dashboard$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardLayout"], {
        contentPadding: "horizontal",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionnaireContent, {}, void 0, false, {
            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_c = QuestionnairePage;
function QuestionnaireContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [storedProgress, setStoredProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExitDialogOpen, setIsExitDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const exitTargetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasRestoredStepIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [submissionError, setSubmissionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeStepIndex, setActiveStepIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const groupedQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[groupedQuestions]": ()=>{
            const grouping = {
                profile: [],
                initiator: [],
                regulator: [],
                client: [],
                financial: [],
                program: [],
                exchange: [],
                internal: [],
                operations: [],
                trade: [],
                constraints: [],
                sector: []
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_DEFINITIONS"].forEach({
                "QuestionnaireContent.useMemo[groupedQuestions]": (question)=>{
                    grouping[question.group].push(question);
                }
            }["QuestionnaireContent.useMemo[groupedQuestions]"]);
            return grouping;
        }
    }["QuestionnaireContent.useMemo[groupedQuestions]"], []);
    const groupVisibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[groupVisibility]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$block$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeGroupVisibility"])(answers)
    }["QuestionnaireContent.useMemo[groupVisibility]"], [
        answers
    ]);
    const persistAnswers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionnaireContent.useCallback[persistAnswers]": (nextAnswers)=>{
            setAnswers(nextAnswers);
            if ("TURBOPACK compile-time truthy", 1) {
                sessionStorage.setItem('wizardAnswers', JSON.stringify(nextAnswers));
            }
        }
    }["QuestionnaireContent.useCallback[persistAnswers]"], []);
    const clearStoredStepIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionnaireContent.useCallback[clearStoredStepIndex]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            sessionStorage.removeItem(WIZARD_ACTIVE_STEP_KEY);
        }
    }["QuestionnaireContent.useCallback[clearStoredStepIndex]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            try {
                const stored = ("TURBOPACK compile-time truthy", 1) ? sessionStorage.getItem('wizardAnswers') : "TURBOPACK unreachable";
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setAnswers(coerceStoredAnswers(parsed));
                }
            } catch (error) {
                console.warn('Failed to restore questionnaire answers', error);
            }
        }
    }["QuestionnaireContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            if ("object" === 'undefined' || hasRestoredStepIndex.current) return;
            const storedIndex = sessionStorage.getItem(WIZARD_ACTIVE_STEP_KEY);
            if (storedIndex !== null) {
                const parsedIndex = Number.parseInt(storedIndex, 10);
                if (!Number.isNaN(parsedIndex) && parsedIndex >= 0) {
                    setActiveStepIndex(parsedIndex);
                }
            }
            hasRestoredStepIndex.current = true;
        }
    }["QuestionnaireContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            if ("object" === 'undefined' || !hasRestoredStepIndex.current) return;
            sessionStorage.setItem(WIZARD_ACTIVE_STEP_KEY, String(activeStepIndex));
        }
    }["QuestionnaireContent.useEffect"], [
        activeStepIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            setStoredProgress((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wizard$2d$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasAnyWizardProgress"])());
        }
    }["QuestionnaireContent.useEffect"], [
        answers
    ]);
    const stepStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[stepStates]": ()=>{
            return STEP_DEFINITIONS.map({
                "QuestionnaireContent.useMemo[stepStates]": (step)=>({
                        ...step,
                        visibleGroups: step.groups.filter({
                            "QuestionnaireContent.useMemo[stepStates]": (group)=>{
                                var _groupedQuestions_group;
                                var _groupedQuestions_group_length;
                                return groupVisibility[group] && ((_groupedQuestions_group_length = (_groupedQuestions_group = groupedQuestions[group]) === null || _groupedQuestions_group === void 0 ? void 0 : _groupedQuestions_group.length) !== null && _groupedQuestions_group_length !== void 0 ? _groupedQuestions_group_length : 0) > 0;
                            }
                        }["QuestionnaireContent.useMemo[stepStates]"])
                    })
            }["QuestionnaireContent.useMemo[stepStates]"]);
        }
    }["QuestionnaireContent.useMemo[stepStates]"], [
        groupVisibility,
        groupedQuestions
    ]);
    const activeSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[activeSteps]": ()=>stepStates.filter({
                "QuestionnaireContent.useMemo[activeSteps]": (step)=>step.visibleGroups.length > 0
            }["QuestionnaireContent.useMemo[activeSteps]"])
    }["QuestionnaireContent.useMemo[activeSteps]"], [
        stepStates
    ]);
    const stepperSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[stepperSteps]": ()=>activeSteps.map({
                "QuestionnaireContent.useMemo[stepperSteps]": (step)=>({
                        id: step.id,
                        title: step.title
                    })
            }["QuestionnaireContent.useMemo[stepperSteps]"])
    }["QuestionnaireContent.useMemo[stepperSteps]"], [
        activeSteps
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            if (activeSteps.length === 0) {
                setActiveStepIndex(0);
                return;
            }
            if (activeStepIndex >= activeSteps.length) {
                setActiveStepIndex(activeSteps.length - 1);
            }
        }
    }["QuestionnaireContent.useEffect"], [
        activeSteps,
        activeStepIndex
    ]);
    var _activeSteps_activeStepIndex;
    const currentStep = (_activeSteps_activeStepIndex = activeSteps[activeStepIndex]) !== null && _activeSteps_activeStepIndex !== void 0 ? _activeSteps_activeStepIndex : null;
    const isLastStep = activeSteps.length > 0 && activeStepIndex === activeSteps.length - 1;
    const hasPreviousStep = activeStepIndex > 0;
    const isCurrentStepComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[isCurrentStepComplete]": ()=>{
            if (!currentStep) {
                return false;
            }
            return currentStep.visibleGroups.every({
                "QuestionnaireContent.useMemo[isCurrentStepComplete]": (group)=>{
                    var _groupedQuestions_group;
                    const questions = (_groupedQuestions_group = groupedQuestions[group]) !== null && _groupedQuestions_group !== void 0 ? _groupedQuestions_group : [];
                    if (questions.length === 0) {
                        return true;
                    }
                    return questions.every({
                        "QuestionnaireContent.useMemo[isCurrentStepComplete]": (question)=>hasProgressAnswer(answers[question.id])
                    }["QuestionnaireContent.useMemo[isCurrentStepComplete]"]);
                }
            }["QuestionnaireContent.useMemo[isCurrentStepComplete]"]);
        }
    }["QuestionnaireContent.useMemo[isCurrentStepComplete]"], [
        answers,
        currentStep,
        groupedQuestions
    ]);
    const clearGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionnaireContent.useCallback[clearGroups]": (groups)=>{
            const nextAnswers = {
                ...answers
            };
            let changed = false;
            groups.forEach({
                "QuestionnaireContent.useCallback[clearGroups]": (group)=>{
                    var _groupedQuestions_group;
                    (_groupedQuestions_group = groupedQuestions[group]) === null || _groupedQuestions_group === void 0 ? void 0 : _groupedQuestions_group.forEach({
                        "QuestionnaireContent.useCallback[clearGroups]": (question)=>{
                            if (nextAnswers[question.id] !== undefined) {
                                delete nextAnswers[question.id];
                                changed = true;
                            }
                        }
                    }["QuestionnaireContent.useCallback[clearGroups]"]);
                }
            }["QuestionnaireContent.useCallback[clearGroups]"]);
            if (changed) {
                persistAnswers(nextAnswers);
            }
        }
    }["QuestionnaireContent.useCallback[clearGroups]"], [
        answers,
        groupedQuestions,
        persistAnswers
    ]);
    const goToNextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionnaireContent.useCallback[goToNextStep]": ()=>{
            if (activeSteps.length === 0) return;
            setActiveStepIndex({
                "QuestionnaireContent.useCallback[goToNextStep]": (prev)=>Math.min(prev + 1, activeSteps.length - 1)
            }["QuestionnaireContent.useCallback[goToNextStep]"]);
        }
    }["QuestionnaireContent.useCallback[goToNextStep]"], [
        activeSteps.length
    ]);
    const goToPreviousStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionnaireContent.useCallback[goToPreviousStep]": ()=>{
            setActiveStepIndex({
                "QuestionnaireContent.useCallback[goToPreviousStep]": (prev)=>Math.max(prev - 1, 0)
            }["QuestionnaireContent.useCallback[goToPreviousStep]"]);
        }
    }["QuestionnaireContent.useCallback[goToPreviousStep]"], []);
    const handleSkipCurrentStep = ()=>{
        if (!currentStep) return;
        clearGroups(currentStep.groups);
        goToNextStep();
    };
    const handleNextStep = ()=>{
        if (!isLastStep) {
            goToNextStep();
        }
    };
    const handlePreviousStep = ()=>{
        if (hasPreviousStep) {
            goToPreviousStep();
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionnaireContent.useEffect": ()=>{
            if (!answers || Object.keys(answers).length === 0) {
                return;
            }
            const nextAnswers = {
                ...answers
            };
            let changed = false;
            QUESTION_GROUP_ORDER.forEach({
                "QuestionnaireContent.useEffect": (group)=>{
                    var _groupedQuestions_group;
                    if (groupVisibility[group]) return;
                    (_groupedQuestions_group = groupedQuestions[group]) === null || _groupedQuestions_group === void 0 ? void 0 : _groupedQuestions_group.forEach({
                        "QuestionnaireContent.useEffect": (question)=>{
                            if (nextAnswers[question.id] !== undefined) {
                                delete nextAnswers[question.id];
                                changed = true;
                            }
                        }
                    }["QuestionnaireContent.useEffect"]);
                }
            }["QuestionnaireContent.useEffect"]);
            if (changed) {
                setAnswers(nextAnswers);
                if ("TURBOPACK compile-time truthy", 1) {
                    sessionStorage.setItem('wizardAnswers', JSON.stringify(nextAnswers));
                }
            }
        }
    }["QuestionnaireContent.useEffect"], [
        answers,
        groupVisibility,
        groupedQuestions
    ]);
    const answeredCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionnaireContent.useMemo[answeredCount]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_DEFINITIONS"].filter({
                "QuestionnaireContent.useMemo[answeredCount]": (question)=>hasAnswer(answers[question.id])
            }["QuestionnaireContent.useMemo[answeredCount]"]).length;
        }
    }["QuestionnaireContent.useMemo[answeredCount]"], [
        answers
    ]);
    const totalQuestions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_DEFINITIONS"].length;
    const progressRatio = totalQuestions > 0 ? answeredCount / totalQuestions : 0;
    const handleSingleChange = (questionId, value)=>{
        persistAnswers({
            ...answers,
            [questionId]: value
        });
    };
    const handleMultiToggle = (questionId, optionValue)=>{
        const current = Array.isArray(answers[questionId]) ? answers[questionId] : [];
        if (optionValue === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]) {
            const next = current.includes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]) ? [] : [
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]
            ];
            persistAnswers({
                ...answers,
                [questionId]: next
            });
            return;
        }
        const filtered = current.filter((value)=>value !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]);
        const exists = filtered.includes(optionValue);
        const next = exists ? filtered.filter((value)=>value !== optionValue) : [
            ...filtered,
            optionValue
        ];
        persistAnswers({
            ...answers,
            [questionId]: next
        });
    };
    const handleFreeTextChange = (questionId, value)=>{
        persistAnswers({
            ...answers,
            [questionId]: value
        });
    };
    const requestExit = (target)=>{
        const hasProgress = storedProgress || Object.keys(answers).length > 0;
        if (!hasProgress) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wizard$2d$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearWizardProgress"])();
            clearStoredStepIndex();
            setActiveStepIndex(0);
            router.push(target);
            return;
        }
        exitTargetRef.current = target;
        setIsExitDialogOpen(true);
    };
    const handleExitCancel = ()=>{
        exitTargetRef.current = null;
        setIsExitDialogOpen(false);
    };
    const handleExitConfirm = ()=>{
        var _exitTargetRef_current;
        const target = (_exitTargetRef_current = exitTargetRef.current) !== null && _exitTargetRef_current !== void 0 ? _exitTargetRef_current : '/dashboard';
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wizard$2d$progress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearWizardProgress"])();
        clearStoredStepIndex();
        setActiveStepIndex(0);
        setIsExitDialogOpen(false);
        exitTargetRef.current = null;
        router.push(target);
    };
    const handleSubmit = (event)=>{
        event.preventDefault();
        if (isSubmitting) return;
        const hasAtLeastOneAnswer = Object.values(answers).some((value)=>hasAnswer(value));
        if (!hasAtLeastOneAnswer) {
            setSubmissionError('Пожалуйста, ответьте хотя бы на один вопрос перед продолжением.');
            return;
        }
        setSubmissionError(null);
        setIsSubmitting(true);
        try {
            const evaluation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluateQuestionnaire"])(answers);
            persistEvaluation(evaluation);
            persistAnswers(answers);
            router.push('/projects/new/select-reports');
        } catch (error) {
            console.error('Failed to evaluate questionnaire', error);
            setSubmissionError('Не удалось обработать ответы. Попробуйте ещё раз или обратитесь в поддержку.');
        } finally{
            setIsSubmitting(false);
        }
    };
    const persistEvaluation = (result)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        sessionStorage.setItem('decisionEngineResult', JSON.stringify(result));
        const templateCodes = deriveTemplateCodes(result);
        sessionStorage.setItem('recommendedTemplates', JSON.stringify(templateCodes));
    };
    const deriveTemplateCodes = (result)=>{
        const codes = new Set();
        const allReports = [
            ...result.mandatoryReports,
            ...result.recommendedReports,
            ...result.optionalReports
        ];
        allReports.forEach((report)=>{
            const mapped = ENGINE_TO_TEMPLATE_MAP[report.id];
            if (mapped) {
                codes.add(mapped);
            }
        });
        return Array.from(codes);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-2xl space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-20 bg-background/95 pb-4 pt-6 backdrop-blur supports-[backdrop-filter]:bg-background/80",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-3xl font-bold tracking-tight",
                                                children: "Расширенный опросник"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground mt-1",
                                                children: "Ответьте на вопросы — движок рекомендаций подберёт релевантные отчёты."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 454,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 452,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: ()=>requestExit('/dashboard'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 459,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 458,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 451,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 h-2 rounded-full bg-muted overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full bg-primary transition-all",
                                                style: {
                                                    width: "".concat(Math.max(5, progressRatio * 100), "%")
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 465,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 464,
                                        columnNumber: 13
                                    }, this),
                                    activeSteps.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium",
                                                children: "Блоки опросника"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 474,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$stepper$2f$title$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TitleStatusStepper"], {
                                                steps: stepperSteps,
                                                activeIndex: activeStepIndex,
                                                onStepChange: setActiveStepIndex
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 473,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 463,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this),
                    submissionError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive",
                        children: submissionError
                    }, void 0, false, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "space-y-6",
                        style: {
                            paddingBottom: CONTENT_BOTTOM_PADDING
                        },
                        onSubmit: handleSubmit,
                        children: [
                            currentStep ? currentStep.visibleGroups.map((group)=>{
                                const meta = QUESTION_GROUP_TITLES[group];
                                const questions = groupedQuestions[group];
                                if (!questions || questions.length === 0) return null;
                                var _meta_title;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border-muted",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    children: (_meta_title = meta === null || meta === void 0 ? void 0 : meta.title) !== null && _meta_title !== void 0 ? _meta_title : group
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 21
                                                }, this),
                                                (meta === null || meta === void 0 ? void 0 : meta.description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: meta.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 499,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-6",
                                            children: questions.map((question)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionField, {
                                                    question: question,
                                                    value: answers[question.id],
                                                    onSingleChange: handleSingleChange,
                                                    onMultiToggle: handleMultiToggle,
                                                    onFreeTextChange: handleFreeTextChange
                                                }, question.id, false, {
                                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 503,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, group, true, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 498,
                                    columnNumber: 17
                                }, this);
                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "border-dashed",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "Нет вопросов для отображения"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 521,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            children: "Похоже, текущий набор условий не включает активных блоков. Вернитесь назад или измените ответы."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 522,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 520,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 519,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
                                style: {
                                    minHeight: ACTION_BAR_HEIGHT
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pointer-events-auto mx-auto w-full max-w-7xl px-6 py-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "outline",
                                                onClick: handlePreviousStep,
                                                disabled: !hasPreviousStep,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Предыдущий блок"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 535,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-1 justify-end gap-2 sm:flex-none",
                                                children: [
                                                    !isLastStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        variant: "ghost",
                                                        onClick: handleSkipCurrentStep,
                                                        disabled: !currentStep,
                                                        children: "Пропустить блок"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 21
                                                    }, this),
                                                    isLastStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "submit",
                                                        className: "flex-1 sm:flex-none",
                                                        disabled: isSubmitting,
                                                        children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    className: "mr-2 h-4 w-4 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                                    lineNumber: 548,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Обрабатываем ответы…"
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                "Перейти к выбору отчётов",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                    className: "ml-2 h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                        lineNumber: 545,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        className: "flex-1 sm:flex-none",
                                                        onClick: handleNextStep,
                                                        disabled: !currentStep || !isCurrentStepComplete,
                                                        children: [
                                                            "Далее",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                className: "ml-2 h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                                lineNumber: 566,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                        lineNumber: 559,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                                lineNumber: 538,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 533,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isExitDialogOpen,
                onOpenChange: (open)=>!open && handleExitCancel(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Выйти из мастера?"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 579,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Введённые ответы будут очищены, если покинуть шаг сейчас."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 580,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                            lineNumber: 578,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    onClick: handleExitCancel,
                                    children: "Остаться"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 585,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleExitConfirm,
                                    children: "Выйти"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 586,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                            lineNumber: 584,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                    lineNumber: 577,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 576,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(QuestionnaireContent, "Ms8J6OPeVa0K8ugt5g1bY6t25lw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = QuestionnaireContent;
function QuestionField(param) {
    let { question, value, onSingleChange, onMultiToggle, onFreeTextChange } = param;
    _s1();
    const selectedValues = Array.isArray(value) ? value : [];
    const optionsWithUnknown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionField.useMemo[optionsWithUnknown]": ()=>{
            if (!question.options) return undefined;
            if (question.type === 'free-text') return question.options;
            return ensureUnknownOption(question.options);
        }
    }["QuestionField.useMemo[optionsWithUnknown]"], [
        question.options,
        question.type
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-base font-semibold",
                        children: question.text
                    }, void 0, false, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    question.hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: question.hint
                    }, void 0, false, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 614,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            question.type === 'single' && optionsWithUnknown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
                value: typeof value === 'string' ? value : '',
                onValueChange: (nextValue)=>onSingleChange(question.id, nextValue),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: optionsWithUnknown.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 hover:bg-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                    value: option.code,
                                    id: "".concat(question.id, "-").concat(option.code)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 628,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium leading-none",
                                            children: option.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 630,
                                            columnNumber: 19
                                        }, this),
                                        option.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: option.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                            lineNumber: 632,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                    lineNumber: 629,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, option.code, true, {
                            fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                            lineNumber: 624,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                    lineNumber: 622,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 618,
                columnNumber: 9
            }, this),
            question.type === 'multi' && optionsWithUnknown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: optionsWithUnknown.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 hover:bg-accent",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                id: "".concat(question.id, "-").concat(option.code),
                                checked: selectedValues.includes(option.code),
                                onCheckedChange: ()=>onMultiToggle(question.id, option.code)
                            }, void 0, false, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 648,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium leading-none",
                                        children: option.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 17
                                    }, this),
                                    option.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: option.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                        lineNumber: 656,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                                lineNumber: 653,
                                columnNumber: 15
                            }, this)
                        ]
                    }, option.code, true, {
                        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                        lineNumber: 644,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 642,
                columnNumber: 9
            }, this),
            question.type === 'free-text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                value: typeof value === 'string' ? value : '',
                onChange: (event)=>onFreeTextChange(question.id, event.target.value),
                placeholder: "Ваш ответ"
            }, void 0, false, {
                fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
                lineNumber: 665,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/projects/new/questionnaire/page.tsx",
        lineNumber: 611,
        columnNumber: 5
    }, this);
}
_s1(QuestionField, "TMFMaBlQ2kqo/TTkTnT0NfguY3s=");
_c2 = QuestionField;
function hasAnswer(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasMeaningfulAnswer"])(value);
}
function hasProgressAnswer(value) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$answer$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasMeaningfulAnswer"])(value)) {
        return true;
    }
    return includesUnknownAnswer(value);
}
function includesUnknownAnswer(value) {
    if (typeof value === 'string') {
        return value.trim() === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"];
    }
    if (Array.isArray(value)) {
        return value.some((item)=>typeof item === 'string' && item.trim() === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"]);
    }
    return false;
}
function ensureUnknownOption(options) {
    if (options.some((option)=>option.code === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"])) {
        return options;
    }
    return [
        ...options,
        {
            code: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_CODE"],
            label: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_LABEL"],
            description: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNKNOWN_ANSWER_DESCRIPTION"]
        }
    ];
}
function coerceStoredAnswers(raw) {
    const result = {
        ...raw
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questionnaires$2f$decision$2d$engine$2f$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUESTION_DEFINITIONS"].forEach((question)=>{
        const value = raw[question.id];
        if (value === undefined) {
            return;
        }
        if (question.type === 'multi') {
            if (Array.isArray(value)) {
                return;
            }
            if (value === null || value === '') {
                result[question.id] = [];
                return;
            }
            result[question.id] = [
                String(value)
            ];
            return;
        }
        if (Array.isArray(value)) {
            result[question.id] = value.length > 0 ? value[0] : null;
        }
    });
    return result;
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QuestionnairePage");
__turbopack_context__.k.register(_c1, "QuestionnaireContent");
__turbopack_context__.k.register(_c2, "QuestionField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c2beeb51._.js.map