<!DOCTYPE html>
    <!--[if IE 9 ]><html class="ie9"><![endif]-->
    <head>
        
    </head>
    
    <body class="login-content">
        <!-- Login -->

        <div class="lc-block toggled" id="l-login">
        <form method="POST" action="/login">
            <input type="hidden" name="_csrf" value="jCl4VwYX2iWW6+RkoUuLdRcIdip2vNtHUcmu8=">
            <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-person"></i></span>
                <div class="fg-line">
                    <input class="form-control" name="email" id="email" placeholder="Email" autofocus>
                </div>
            </div>
            
            <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-accessibility"></i></span>
                <div class="fg-line">
                    <input  type="password" name="password" id="password" placeholder="Password" class="form-control">
                </div>
            </div>
           
                
                <center>OR</center>
                <center class=".p-10">Login using</center><center>
<a href="/auth/facebook" style="display: inline-block; width: 10%;">
                                    <img src="/alpha/img/social/facebook-128.png" class="img-responsive" alt="" >
                                </a>
                                
                                <a href="/auth/twitter" style="display: inline-block; width: 10%;">
                                    <img src="/alpha/img/social/twitter-128.png" class="img-responsive" alt="">
                                </a>
                                
                                <a href="/auth/google" style="display: inline-block; width: 10%;">
                                    <img src="/alpha/img/social/googleplus-128.png" class="img-responsive" alt="">
                                </a></center>
              
           
                
            
            <div class="clearfix"></div>
            
<!--             <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    <i class="input-helper"></i>
                    Keep me signed in
                </label>
            </div> -->
            <button type="submit" class="btn btn-login btn-danger btn-float"><i class="md md-arrow-forward"></i></button>
            
            <ul class="login-navigation">
                <li data-block="#l-register" class="bgm-red">Register</li>
                <li data-block="#l-forget-password" class="bgm-orange">Forgot Password?</li>
            </ul>
            </form>
        </div>
        
        <!-- Register -->
        <div class="lc-block" id="l-register">
        <form id="signup-form" method="POST" action="/signup">
            <input type="hidden" name="_csrf" value="jCl4VwYX2iWW6+RkoUuLdRcIdip2vNtHUcmu8=">            
            <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-mail"></i></span>
                <div class="fg-line">
                    <input type="email" name="email" id="email" placeholder="Email" autofocus class="form-control" >
                </div>
            </div>
            
            <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-accessibility"></i></span>
                <div class="fg-line">
                  <input type="password" name="password" id="password" placeholder="Password" class="form-control">                </div>
            </div>
             <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-accessibility"></i></span>
                <div class="fg-line">
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" class="form-control">
            </div>
            
            </div>
            <div>
                <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-accessibility"></i></span>
                <div class="fg-line">
                  <input type="number" name="phone" id="phone" placeholder="Phone" class="form-control" required>
            </div>
            </div>
            
            
            <div class="clearfix"></div>
            
            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    <i class="input-helper"></i>
                    Accept the <a href="/terms">license agreement</a>
                </label>
            </div>
            <button type="submit" class="btn btn-login btn-danger btn-float"><i class="md md-arrow-forward"></i></button>
            
            <ul class="login-navigation">
                <li data-block="#l-login" class="bgm-green">Login</li>
                <li data-block="#l-forget-password" class="bgm-orange">Forgot Password?</li>
            </ul>
            </form>
        </div>
        
        <!-- Forgot Password -->
        <div class="lc-block" id="l-forget-password">
            <p class="text-left">If you're having issues signing in with your Regrob ID password, enter your email to reset it and regain access to your Regrob account.</p>
             <form method="POST" action="/forgot">
                             <input type="hidden" name="_csrf" value="jCl4VwYX2iWW6+RkoUuLdRcIdip2vNtHUcmu8=">
            <div class="input-group m-b-20">
                <span class="input-group-addon"><i class="md md-email"></i></span>
                <div class="fg-line">
                     <input type="email" name="email" id="email" placeholder="Email" autofocus class="form-control">
                </div>
            </div>
            
                      <button type="submit" class="btn btn-login btn-danger btn-float"><i class="md md-arrow-forward"></i></button>
            
            
            <ul class="login-navigation">
                <li data-block="#l-login" class="bgm-green">Login</li>
                <li data-block="#l-register" class="bgm-red">Register</li>
            </ul>
            </form>
        </div>
        
       
        
    </body>
</html>