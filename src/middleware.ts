export { auth as middleware } from "@/auth"

// import { auth } from "@/auth"
// import { NextRequest, NextResponse } from "next/server"

// export default auth((request: NextRequest) => {
//   // Clone the request headers and set a new header `x-hello-from-middleware1`
//   const requestHeaders = new Headers(request.headers)
//   const requestpath = request.nextUrl.href.split('/')[4]
//   requestHeaders.set('requestpath', requestpath)

//   // You can also set request headers in NextResponse.rewrite
//   const response = NextResponse.next({
//     request: {
//       // New request headers
//       headers: requestHeaders,
//     },
//   })

// // Set a new response header `x-hello-from-middleware2`
//    response.headers.set('x-hello-from-middleware2', 'hello')
//    return response
//  })

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}