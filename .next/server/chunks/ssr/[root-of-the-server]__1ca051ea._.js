module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/app/vision-board/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Page)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const categories = [
    "personal growth",
    "health and fitness",
    "career and ambition",
    "wealth",
    "meaning and spirituality",
    "relationships",
    "travel",
    "hobbies"
];
function Page() {
    const [goals, setGoals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [collageUrl, setCollageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleChange = (cat, val)=>{
        setGoals((p)=>({
                ...p,
                [cat]: val
            }));
        const len = val.trim().length;
        setStatus((p)=>({
                ...p,
                [cat]: len === 0 ? "blank" : len >= 40 ? "valid" : "invalid"
            }));
    };
    const css = (s)=>s === "valid" ? "bg-[#C4EDEE]" : s === "invalid" ? "bg-[#FFDFE9]" : "bg-gray-100";
    const handleSubmit = async ()=>{
        setCollageUrl(null);
        setLoading(true);
        try {
            const bullets = categories.map((cat)=>{
                const goal = goals[cat]?.trim() || "no specific goal provided";
                return `• ${cat.toUpperCase()}: ${goal}`;
            });
            const prompt = [
                "Generate a single high-resolution **vision board collage** for the year 2025.",
                "Design the layout like a real-world **handmade vision board or scrapbook**, placed on a neutral, textured background (like corkboard or craft paper).",
                "",
                "The style should be cozy, aesthetic, and modern: pastel tones, paper cutouts, Polaroid-style frames, masking tape, doodles, magazine clippings, and organic torn-paper edges. Use a matte finish and soft lighting.",
                "",
                "Each category below must be visually represented using **2–3 symbolic or literal visuals per category** (such as scenes, objects, symbols).",
                "Draw inspiration from real-world metaphors, *not generic clipart*.",
                "",
                "✅ **Do NOT use any text in the image**, except for the title **'VISION BOARD 2025'** in a papercut or handwritten style at the top center.",
                "❌ No category names, labels, or captions.",
                "✅ For any people shown, use stylized **faceless mannequins**, silhouettes, or back-facing figures only — avoid eyes, mouths, or realistic facial features.",
                "",
                "Use visual storytelling and metaphor to reflect the user’s ACTUAL goals:",
                ...bullets,
                "",
                "Place the visuals in an **artistic, balanced collage format**, with natural overlaps, layers, and taped corners — no grid or boxy layout.",
                "Avoid empty space. The collage should feel complete, intentional, and curated.",
                "",
                "Use props like flowers, Polaroid borders, pins, tape, torn paper, plants, and paint swatches to decorate the layout without cluttering the main visuals.",
                "",
                "The result should look like a physical collage made by someone manifesting their dream life in 2025.",
                "",
                "Style keywords: vision board, soft scrapbook, handmade, pastel aesthetic, Pinterest layout, cozy, faceless figures, realistic objects, metaphors, matte finish, layered textures."
            ].join("\n");
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    numImages: 1
                })
            });
            if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(()=>"")}`);
            const { images, error } = await res.json();
            if (error) throw new Error(error);
            if (!images || images.length === 0) throw new Error("No image returned");
            setCollageUrl(images[0]);
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white pr-[10%] pl-[8%] pt-[8%] pb-[5%]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "title pl-[1%] ",
                children: "See your vision come to life."
            }, void 0, false, {
                fileName: "[project]/app/vision-board/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "description pt-[1%] pb-[4%] pl-[1%]",
                children: "Fill in as many categories as you can. Add lots of detail to make your images more accurate. When you are done, click generate. "
            }, void 0, false, {
                fileName: "[project]/app/vision-board/page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8 w-full",
                children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-4 rounded-3xl ${css(status[cat])}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-medium capitalize pl-2 pb-2",
                                children: cat
                            }, void 0, false, {
                                fileName: "[project]/app/vision-board/page.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: (el)=>{
                                    if (el) {
                                        el.style.height = "auto";
                                        el.style.height = el.scrollHeight + "px";
                                    }
                                },
                                onInput: (e)=>{
                                    e.currentTarget.style.height = "auto";
                                    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                                },
                                placeholder: `Enter your goal for ${cat}`,
                                value: goals[cat] || "",
                                onChange: (e)=>handleChange(cat, e.target.value),
                                className: `w-full min-h-[60px] resize-none rounded-xl p-2 font-light focus:outline-none focus:ring-0  ${css(status[cat])}`
                            }, void 0, false, {
                                fileName: "[project]/app/vision-board/page.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            status[cat] === "invalid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[#FF4F87] mt-1 font-light",
                                children: "Please add more detail for an accurate board."
                            }, void 0, false, {
                                fileName: "[project]/app/vision-board/page.tsx",
                                lineNumber: 130,
                                columnNumber: 17
                            }, this)
                        ]
                    }, cat, true, {
                        fileName: "[project]/app/vision-board/page.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/vision-board/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 text-center pt-[2%]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleSubmit,
                    disabled: loading,
                    className: "hover:bg-[#FF4F87] bg-black text-white font-light py-3 px-6 rounded-3xl disabled:opacity-50",
                    children: loading ? "Generating…" : "Generate Visbo"
                }, void 0, false, {
                    fileName: "[project]/app/vision-board/page.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/vision-board/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            collageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mst-10 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: collageUrl,
                    alt: "vision-board-2025-collage",
                    className: "max-w-full h-auto rounded shadow-xl"
                }, void 0, false, {
                    fileName: "[project]/app/vision-board/page.tsx",
                    lineNumber: 149,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/vision-board/page.tsx",
                lineNumber: 148,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/vision-board/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else {
                "TURBOPACK unreachable";
            }
        } else {
            "TURBOPACK unreachable";
        }
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__1ca051ea._.js.map