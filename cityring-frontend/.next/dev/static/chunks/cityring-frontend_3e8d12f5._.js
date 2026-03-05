(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/cityring-frontend/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/cityring-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/cityring-frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://lothxgfuxfaqwewcjkgr.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_dt8a376XT0OgHf5H6zTSsA_aspxLDMf");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/cityring-frontend/app/register/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cityring-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cityring-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cityring-frontend/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function RegisterPage() {
    _s();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("instagram");
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        dob: "",
        email: "",
        instagram: "",
        whatsapp: "",
        telegram: "",
        password: "",
        confirmPassword: ""
    });
    // ✅ NEW: plans from DB
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [plansLoading, setPlansLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // ✅ plan selection
    const [planId, setPlanId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterPage.useEffect": ()=>{
            async function loadPlans() {
                setPlansLoading(true);
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("membership_plans").select("id,title,subtitle,price,group_limit,is_active,sort_order").eq("is_active", true).order("sort_order", {
                    ascending: true
                });
                if (error) {
                    console.error("Failed to load plans:", error);
                    setPlans([]);
                } else {
                    setPlans(data || []);
                }
                setPlansLoading(false);
            }
            loadPlans();
        }
    }["RegisterPage.useEffect"], []);
    const requiredFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RegisterPage.useMemo[requiredFields]": ()=>{
            if (mode === "instagram") return [
                "name",
                "dob",
                "instagram"
            ];
            if (mode === "whatsapp") return [
                "name",
                "dob",
                "whatsapp"
            ];
            if (mode === "telegram") return [
                "name",
                "dob",
                "telegram"
            ];
            return [
                "name",
                "dob",
                "instagram",
                "whatsapp",
                "telegram"
            ];
        }
    }["RegisterPage.useMemo[requiredFields]"], [
        mode
    ]);
    const selectedPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RegisterPage.useMemo[selectedPlan]": ()=>{
            return plans.find({
                "RegisterPage.useMemo[selectedPlan]": (p)=>p.id === planId
            }["RegisterPage.useMemo[selectedPlan]"]) || null;
        }
    }["RegisterPage.useMemo[selectedPlan]"], [
        plans,
        planId
    ]);
    const isValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RegisterPage.useMemo[isValid]": ()=>{
            // must pick plan
            if (!planId) return false;
            // must have plans loaded (avoid selecting stale)
            if (plansLoading) return false;
            // ✅ Email required
            if (!form.email || !form.email.trim()) return false;
            for (const key of requiredFields){
                const v = form[key];
                if (!v || !v.trim()) return false;
            }
            if (!form.password || form.password.length < 6) return false;
            if (form.password !== form.confirmPassword) return false;
            return true;
        }
    }["RegisterPage.useMemo[isValid]"], [
        form,
        requiredFields,
        planId,
        plansLoading
    ]);
    function updateField(key, value) {
        setForm((prev)=>({
                ...prev,
                [key]: value
            }));
    }
    async function handlePayNow() {
        if (!isValid || submitting) return;
        if (!selectedPlan) {
            alert("Please select a plan.");
            return;
        }
        setSubmitting(true);
        try {
            const cleanEmail = form.email.trim().toLowerCase();
            // ✅ 1) Create Supabase Auth user
            const { error: signUpError } = await __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                email: cleanEmail,
                password: form.password
            });
            if (signUpError) {
                console.error("Auth signUp failed:", {
                    message: signUpError?.message,
                    status: signUpError?.status,
                    raw: signUpError
                });
                alert(`Registration failed (Auth): ${signUpError.message}`);
                setSubmitting(false);
                return;
            }
            // ✅ 2) Create profile via RPC (your existing logic)
            const rpcPayload = {
                _name: form.name.trim(),
                _dob: form.dob,
                _email: cleanEmail,
                _network_mode: mode,
                _instagram: mode === "instagram" || mode === "all" ? form.instagram.trim() || null : null,
                _whatsapp: mode === "whatsapp" || mode === "all" ? form.whatsapp.trim() || null : null,
                _telegram: mode === "telegram" || mode === "all" ? form.telegram.trim() || null : null,
                _plan_id: selectedPlan.id,
                _plan_price: selectedPlan.price,
                _password: form.password
            };
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc("create_profile_with_password", rpcPayload);
            if (error) {
                console.error("Profile insert failed:", {
                    message: error?.message,
                    details: error?.details,
                    hint: error?.hint,
                    code: error?.code,
                    raw: error
                });
                alert(`Registration failed: ${error.message}\n\nIf you enabled RLS, you must add policies or temporarily turn RLS off for profiles while testing.`);
                setSubmitting(false);
                return;
            }
            // ✅ Store profile id for payment step
            localStorage.setItem("cityring_profile_id", String(data));
            // ✅ Store selected plan for payment step (subscriptions upsert)
            localStorage.setItem("selectedPlan", JSON.stringify({
                plan_id: selectedPlan.id,
                plan_price: selectedPlan.price,
                plan_group_limit: selectedPlan.group_limit,
                is_renewal: false
            }));
            // Optional: store draft for payment preview
            const { password, confirmPassword, ...safeForm } = form;
            const draft = {
                mode,
                ...safeForm,
                plan_id: selectedPlan.id,
                plan_price: selectedPlan.price,
                plan_group_limit: selectedPlan.group_limit
            };
            localStorage.setItem("cityring_register_draft", JSON.stringify(draft));
            window.location.href = "/register/payment";
        } catch (e) {
            console.error(e);
            alert("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-black text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto px-6 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "h-2 w-2 rounded-full bg-blue-500/80"
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        "Membership"
                    ]
                }, void 0, true, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mt-3 text-4xl font-semibold tracking-tight",
                    children: "Register"
                }, void 0, false, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-white/65",
                    children: "Choose how you want to network, fill your details, then complete payment."
                }, void 0, false, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 206,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold tracking-tight",
                            children: "How would you like to network?"
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeButton, {
                                    active: mode === "instagram",
                                    onClick: ()=>setMode("instagram"),
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 98
                                    }, void 0),
                                    children: "Instagram"
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeButton, {
                                    active: mode === "whatsapp",
                                    onClick: ()=>setMode("whatsapp"),
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 96
                                    }, void 0),
                                    children: "WhatsApp"
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 219,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeButton, {
                                    active: mode === "telegram",
                                    onClick: ()=>setMode("telegram"),
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTelegramPlane"], {}, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 223,
                                        columnNumber: 96
                                    }, void 0),
                                    children: "Telegram"
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 223,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeButton, {
                                    active: mode === "all",
                                    onClick: ()=>setMode("all"),
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaGlobe"], {}, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 86
                                    }, void 0),
                                    children: "All Three"
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold tracking-tight",
                            children: "Choose a Plan"
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-white/65",
                            children: "Pick a membership plan to continue to payment."
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        plansLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-sm text-white/55",
                            children: "Loading plans..."
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 238,
                            columnNumber: 28
                        }, this),
                        !plansLoading && plans.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-sm text-red-300",
                            children: "No plans available. Please contact admin."
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4",
                            children: plans.map((p)=>{
                                const active = planId === p.id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setPlanId(p.id),
                                    className: `text-left rounded-3xl border p-5 transition ${active ? "border-blue-500/40 bg-blue-500/10" : "border-white/10 bg-black/40 hover:bg-black/55"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-semibold tracking-tight text-white",
                                                            children: p.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-white/65",
                                                            children: p.subtitle ?? ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 text-xs text-white/55",
                                                            children: [
                                                                "Join up to ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-white",
                                                                    children: p.group_limit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                                    lineNumber: 263,
                                                                    columnNumber: 36
                                                                }, this),
                                                                " groups"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-lg font-bold ${active ? "text-blue-200" : "text-white"}`,
                                                    children: [
                                                        "₹",
                                                        p.price
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 19
                                        }, this),
                                        active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 text-xs text-blue-200 font-medium",
                                            children: "Selected"
                                        }, void 0, false, {
                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                            lineNumber: 272,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold tracking-tight",
                            children: "Your Details"
                        }, void 0, false, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Name *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.name,
                                        onChange: (e)=>updateField("name", e.target.value),
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "Your full name"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "DOB *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.dob,
                                        onChange: (e)=>updateField("dob", e.target.value),
                                        type: "date",
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Email *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.email,
                                        onChange: (e)=>updateField("email", e.target.value),
                                        type: "email",
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "you@email.com"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this),
                                (mode === "instagram" || mode === "all") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Instagram Username *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.instagram,
                                        onChange: (e)=>updateField("instagram", e.target.value),
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "eg: yourhandle"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 314,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, this),
                                (mode === "whatsapp" || mode === "all") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "WhatsApp Number *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.whatsapp,
                                        onChange: (e)=>updateField("whatsapp", e.target.value),
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "eg: +91 9876543210"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 324,
                                    columnNumber: 15
                                }, this),
                                (mode === "telegram" || mode === "all") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Telegram Username/Number *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.telegram,
                                        onChange: (e)=>updateField("telegram", e.target.value),
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "eg: @username or number"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 336,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Create Password *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.password,
                                        onChange: (e)=>updateField("password", e.target.value),
                                        type: "password",
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "Minimum 6 characters"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 345,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Confirm Password *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.confirmPassword,
                                        onChange: (e)=>updateField("confirmPassword", e.target.value),
                                        type: "password",
                                        className: "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50",
                                        placeholder: "Re-enter password"
                                    }, void 0, false, {
                                        fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex items-center justify-between flex-wrap gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-white/65",
                                    children: [
                                        "Membership fee:",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-white",
                                            children: [
                                                "₹",
                                                selectedPlan ? selectedPlan.price : "--"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        "(manual UPI for now)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 367,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handlePayNow,
                                    disabled: !isValid || submitting,
                                    className: `px-6 py-3 rounded-2xl text-white transition shadow-[0_0_34px_rgba(37,99,235,0.35)] ${isValid && !submitting ? "bg-blue-600 hover:bg-blue-500" : "bg-white/10 border border-white/10 cursor-not-allowed text-white/60 shadow-none"}`,
                                    type: "button",
                                    children: submitting ? "Saving..." : "Pay Now"
                                }, void 0, false, {
                                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/cityring-frontend/app/register/page.tsx",
                            lineNumber: 366,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-6 text-sm text-white/55",
                    children: "After payment submission, admin will verify and approve your membership."
                }, void 0, false, {
                    fileName: "[project]/cityring-frontend/app/register/page.tsx",
                    lineNumber: 390,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/cityring-frontend/app/register/page.tsx",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/cityring-frontend/app/register/page.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(RegisterPage, "aZX80L5xCKQLA2PWCR0HVpGFBso=");
_c = RegisterPage;
function ModeButton({ active, onClick, children, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: `rounded-2xl border px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${active ? "border-blue-500/40 bg-blue-500/10 text-blue-200" : "border-white/10 bg-black/40 hover:bg-black/55 text-white/80"}`,
        type: "button",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-lg leading-none",
                children: icon
            }, void 0, false, {
                fileName: "[project]/cityring-frontend/app/register/page.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/cityring-frontend/app/register/page.tsx",
                lineNumber: 420,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/cityring-frontend/app/register/page.tsx",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
_c1 = ModeButton;
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm font-medium text-white/80",
                children: label
            }, void 0, false, {
                fileName: "[project]/cityring-frontend/app/register/page.tsx",
                lineNumber: 428,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$cityring$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2",
                children: children
            }, void 0, false, {
                fileName: "[project]/cityring-frontend/app/register/page.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/cityring-frontend/app/register/page.tsx",
        lineNumber: 427,
        columnNumber: 5
    }, this);
}
_c2 = Field;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "RegisterPage");
__turbopack_context__.k.register(_c1, "ModeButton");
__turbopack_context__.k.register(_c2, "Field");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=cityring-frontend_3e8d12f5._.js.map