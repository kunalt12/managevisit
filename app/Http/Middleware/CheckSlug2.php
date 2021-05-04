<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use App\ApiManagements;
use Closure;

class CheckSlug2
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $API_KEY = $request->headers->get('x-api-key');
        $URL = $request->server->get("REQUEST_URI");
        $pieces = explode("/", $URL);
//        print_r($API_KEY);die;
        //start rohit 
        if($pieces[3] == 'other') {

            $checkSlug = ApiManagements::where('slug', $pieces['4'])->first();

            if($checkSlug != null && session('apiauth') == 'true') {return $next($request); }
             if($checkSlug != null) {
//                 echo '<pre>';print_r($pieces);print_r($checkSlug);
//                 echo '<br>this is API'.$request->input('x-api-key');
//echo '<br>this is api_key '.$checkSlug->api_key;
//echo '<br>this is IP in system'.$checkSlug->ipaddress;
//echo '<br>this is remote address'.$_SERVER['REMOTE_ADDR'];die;
                if($API_KEY != null) {
                    if($checkSlug->api_key == $API_KEY && $checkSlug->ipaddress == $_SERVER['REMOTE_ADDR']) {
                    //Created a session variable so reduces database lookups on each api call.
                        session(['apiauth' => 'true']);
                        session(['apiip' => $checkSlug->ipaddress]);
                        return $next($request);
                    } else {
                        return response()->json(['code' => 103, 'error'=>'API key or IP address is not valid']);
                    }
                } else {
                    return response()->json(['code' => 104, 'error'=>'Please enter API key in header']);
                }
             } else {
                return response()->json(['code' => 105, 'error'=>'Slug is not valid']);
             }
             return response()->json(['code' => 422, 'error'=>'Bad request']);
        }

        if($pieces[2] == 'mobile') {
            $checkSlug = ApiManagements::where('slug', $pieces[3])->first();
            if($checkSlug != null) {
                if($API_KEY != null) {
                    if($checkSlug->api_key == $API_KEY && $checkSlug->ipaddress == $_SERVER['REMOTE_ADDR']) {
                        return $next($request);
                    }
                    else {
                        return response()->json(['code' => 103, 'error'=>'API key or IP address is not valid']);
                    }
                }
                else {
                    return response()->json(['code' => 104, 'error'=>'Please enter API key in header']);
                }
            } else {
                return response()->json(['code' => 105, 'error'=>'Slug is not valid']);
            }
            return response()->json(['code' => 422, 'error'=>'Bad request']);
        }
        else {
            return $next($request);
        }
    }
}
