
<table style="border: 0px">
    <tr style="border: 0px">
          <td style="border: 0px"> <img src="https://user-images.githubusercontent.com/26502711/110235889-004c6b80-7f33-11eb-86bd-5e6558dcf4b3.png" style="width:250px">
          </td>
          <td><span style="font-size: 50px; font-weight: 900"> +</span></td>
          <td style="border: 0px"> <img src="https://user-images.githubusercontent.com/26502711/106351081-1e8ece00-62da-11eb-84d5-96e2c876f8af.png" style="width:250px">
          </td>
          <td><span style="font-size: 50px; font-weight: 900"> = </span></td>
		  <td style="border: 0px"> <img src = "https://user-images.githubusercontent.com/26502711/106351055-f8692e00-62d9-11eb-8da2-8b0e536b2a4b.png"></td>
  </tr>
</table>

# Karee
Let's build your first Flutter Applications using MVC Design Pattern.

To take full advantages of Karee you should know what it offers you
- Karee-CLI a command line interface that help you to manage Karee
- Karee library a dart lib very useful to
  - Organize your project's files and folders
  - Manage your files and classes names
  - Manage your application's Navigation with custom constants
  - Generate all your stateless and stateful screens with names
  - Generate all your controllers
  - Organize your application routes with various structure
  - Generate additionals source

With Karee you should not care because.

- Karee works with `No class Inheritance` on your controller or screen
- Karee use the powerful of `@Annotations` like `@Controller` and `@Screen`
- Karee is fast

# Get Started with `Karee` and `Karee-CLI`

Let's discover `Karee-CLI`

## Karee-CLI installation

Karee-CLI is built using [NodeJS](https://nodejs.org). to install just run `npm install -g karee`

## Create your first Karee application
 
 To create your flutter application based on karee <br/>
 run `karee create` and set up your project

![Karee-create-output](https://user-images.githubusercontent.com/26502711/106352138-2dc54a00-62e1-11eb-8c50-34a04ffd51f1.png)

Open your projet with your favorite text editor mine is [VS Code](https://code.visualstudio.com/) `😌😎`

At the left side your project files organization and the content of your main.dart  at right side

  ### Karee files organization
  In your `lib` you have two directories `app` and `core`
  * App dir
    Your app dir contains some others dir like controllers, entities, routes, screens and components
      - controllers: directory containing all the controllers in your application.
      - entities: directory where your can organize your models
      - screens: Each time you want `karee-cli` to generate a new screen, it will be added to this folder.
      - components: for the global widgets of your application. Note that each screen has its own component folder in its sub-folder
      
![image](https://user-images.githubusercontent.com/26502711/106352233-8694e280-62e1-11eb-8166-7aa1b8f7de23.png)

## Generate a new controller
  We will start by adding a new controller to manage authentication of our app <br/>
  run `karee generate --controller --path auth/ Authentication` or `karee g -c -p auth/ Authentication`  <br/>
  
  it will generate AuthenticationController.dart under *projectDir/lib/app/controllers/auth*
  
  ```java
haranov@bixterprise:~/my_first_app$ karee generate --controller --path auth/ Authentication

>> AuthenticationController generated in lib/app/controllers/auth/authentication_controller.dart
``` 

 ```Dart
  import 'package:my_first_app/core/core.dart';

/// Generated Karee Controller
/// @email champlainmarius20@gmail.com
/// @github ChamplainLeCode
///
/// `Authentication` is set as Controller
@Controller
class AuthenticationController{
   
     String index(){

         return 'AuthenticationController is ready to use';

     }
}
```
  
## Generate a new Screen
  Now let's add login screen for our application
 ```javascript
  haranov@bixterprise:~/my_first_app$ karee generate --screen --path auth/ --name user_login Login
  
  LoginScreen generated in lib/app/screens/auth/login_screen.dart
  ```
  *Note that if you want your screen extends to <b>StatelessWidget</b> add <b>-l</b> option or <b>-f</b> for <b>StatefulWidget</b>, default value is -f* 
  You can see in `lib/app/auth` dir, your file `login_screen.dart` and `components` that contains `congrat_card.dart` , this directory should contains all widgets of your screen
  
 ```Dart
  /// Generated Karee Screen
/// @email champlainmarius20@gmail.com
/// @github ChamplainLeCode
/// `LoginScreen` is set as Screen with name `user_login`
@Screen("user_login")
class  LoginScreen  extends  StatefulWidget {
		_LoginState  createState() => new  _LoginState();
}
class  _LoginState  extends  State<LoginScreen> {
	void  initState(){
		// Add your initialize code here
		super.initState();
	}
	void  dispose(){
		// add your custom code
		super.dispose();
	}
	@override
	Widget  build(BuildContext context) {

		return  Scaffold(
			appBar: AppBar(
				title: Text('Login form')
			),
			body: Center(
				child: CongratCard()
			)
		);
	}
}
```


## Add  Route
  Open [app/routes/Routes.dart]() and subscribe your routes as <br />
 ```Dart
void  registeredRoute() {
	// This default route to load our initial Screen
	Route.on("/", "HomeController@index");
	// This new route to load Login screen
	Route.on("/login", "AuthenticationController@loginScreen");
}
  ```
<b>Notes: </b> if you don't want to create controller, you can directly use short functional notation
 ```Dart
 import  'package:flutter/cupertino.dart'  as cupertino;
import  '../../core/core.dart';

void  registeredRoute() {
	Route.on("/", "HomeController@index");
	Route.on("login",
		(cupertino.BuildContext ctx) =>
			screen('user_login', RouteMode.PUSH, context: ctx));
}
```

Explain what `Route.on( path , action )` means, simply we can say that this bind your route represents by `path` to specific `action` . 
	action can be
- `short functional notation`: Like function name ( *means that it has been already defined* ) or short function notation
 ```javascript
(Type1 arg1, Type2 arg2, ...) => ...
(Type1 arg1, Type2 arg2, ...) {
	// function job
}
```
- `Method invocation`: This allows you to call method from controller by its name. to do that, the string at left part of @ should be the class name of your controller and the method to invoke to the right, <b>eg</b> `AuthenticationController@loginScreen`

<b>Note</b> Args in both forms `Method invocation form` or `short functional definition form` are required positional arguments
or method any controller with notation `ControllerClassName`@`MethodToBindWith`

Now let's update `AuthenticationController` to indicate that we whan to load LoginScreen by its name `user_login`

After editing it will look like

 ```Dart
@Controller
class  AuthenticationController {
	loginScreen(BuildContext ctx) {
		screen(
		   'user_login',
		   RouteMode.PUSH,
		   context: ctx,
		);
	}
}
```

### KareeRouter and RouteMode

- RouteMode
	<b>Notes: </b> Karee provides different ways to navitage between screens. 
		`RouteMode` help you to set what kind of navigation policy you want to.
	*	RouteMode.EMPTY.
				Means that you want to clean navigation before adding current path. 
				Assume that your current navigation path is <b>/settings/user/profile</b> and you want to go back <b>/home</b>, to avoid to remove one by one and push new path, you can use RouteMode.EMPTY, 
	*	RouteMode.POP: Used to remove current context ( screen ) and return to the previous screen
	Assume you are now on user settings screen ( <b>/settings/user</b> ) and you want to go back to <b>/settings</b> you can call *KareeRouter.goBack* with current context (BuildContext) that use previous constant
	*	RouteMode.PUSH: Used to add new navigation context on last one
	*	RouteMode.REPLACE: If you want to pop current context and add new one without make two calls `KareeRouter.goBack` and `KareeRouter.goto`

- KareeRouter
	To navigate between screen you may use `KareeRouter` that offers you two ways to go forward and to go back.
	* KareeRouter.goto( routeName, parameter )
		- `routeName` is the path defined as same as in [Routes.dart]() file
		- `parameter` is arguments list that should be inject in your Route action
	
  ! Hope you have fun `😌😎 `
  
  Now let's define the way to switch from home to login screen 
 ```Dart
  FlatButton( 
	  child: Text("Log in"), 
	  onPressed: () => KareeRouter.goto("/login", parameter: context) 
  )    
```

## Generate source & Run
- Generate source
	You have to run generate source command every time that you want to run you application if you added new screen or if you changed any method's signature in some controller
	The Karee-CLI command to execute is `karee source` after you can run `flutter run` or simply `karee run` to execute the last two commands.

<table>
	<tr>
		<td>
			<img src="https://user-images.githubusercontent.com/26502711/106355907-7be74700-62fb-11eb-84cb-f0e92408f5b2.png" />
		</td>
		<td>
			<img src="https://user-images.githubusercontent.com/26502711/106355939-bd77f200-62fb-11eb-93b2-bae085fff1a7.png" />
		</td>
	</tr>
</table>


## Contributing

Thank you for considering contributing to the Karee library! The contribution guide can be found in the [Karee documentation]().

## License

Karee Library is open-sourced software licensed under the MIT license.