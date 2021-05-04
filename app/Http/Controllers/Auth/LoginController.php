<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Config;
use Auth;
use Carbon\Carbon;


class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function login(Request $request)
    {
        // grab credentials from the request
        $credentials = $request->only('email', 'password');
        // $customClaims= $request->only('company_slug');
        try {
            // attempt to verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.loginfailed')], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.someproblems')], 500);
        }

        $user = \Auth::User();
        $now = Carbon::now();
        $role = $user->getRoles();
        if($user['status']==2 || $user['status']=='2'){
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.nothavepermissionlogin')], 422);
        }
        if(empty($role)) {
            return response()->json(['code' => Config::get('constants.ERROR'), 'error' => Lang::get('message.nothavepermissionlogin')], 422);
        }
        else {
            $result['token'] = $token;
            $result['user'] = $user->toArray();
            $result['permissions'] = $user->getPermissions();
            $result['role'] = $role;
            $result['message'] = Lang::get('message.logged');
            
            return response()->json(['code' => Config::get('constants.SUCCESS'), 'result' => $result]);
        }
    }
    
    /**
    * Log out
    * Invalidate the token, so user cannot use it anymore
    * They have to relogin to get a new token
    *
    * @param Request $request
    */
    public function logout(Request $request) {
        $this->validate($request, [
        'token' => 'required'
        ]);
        JWTAuth::invalidate($request->input('token'));
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'message' => 'Logout successfully.']);
    }
    
    protected function authenticated($request, $user) {
        
        $role = $user->role->role_name;
        if ($role == "Admin") {
            return redirect()->route('dashboard');
        }
    }
    
    /**
    * check_login function
    * Check for user login or not
    * @param Request $request
    * @return void
    */
    public function check_login(Request $request)
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        
        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }
    
    public function reset_token(Request $request){
        return response()->json(['code' => Config::get('constants.SUCCESS'), 'token' => JWTAuth::parseToken()->refresh()]);
    }
}
