<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use App\ApiManagements;
use Closure;

class CheckSlug
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
        $API_KEY = $request->headers->get("x-api-key");
        $URL = $request->server->get("REQUEST_URI");
        $pieces = explode("/", $URL);
        
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
