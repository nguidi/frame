steal(
	'dev/util.js'
,	'dev/styles.js'
,	'dev/controls/login/login.css'
).then(
	function()
	{
		can.Control(
			'Frame.Login'
		,	{
				defaults:
				{
					view:	'dev/views/login/init.mustache'
				,	view_form: undefined
				,	data:
					{
						title: 'Ingreso'
					,	form:
						[
							{
								type: 'text'
							,	name: 'username'
							,	validate:
								{
									required:	true
								,	minLength:	6
								}
							}
						,	{
								type: 'password'
							,	name: 'password'
							,	validate:
								{
									required:	true
								,	minLength:	6
								}
							}
						]
					}
				,	onSigninSuccess:	function() {console.log("Sign in satisfactorio")}
				,	onSigninError:		function() {console.log("Error al realizar sign in")}
				,	onSignupSucess:		function() {console.log("Sign up satisfactorio")}
				,	onSignupError:		function() {console.log("Error al realizar sign up")}
				,	onSignoutSucess:	function() {console.log("Sign out satisfactorio")}
				,	onSignoutError:		function() {console.log("Error al realizar sign out")}
				}
			}
		,	{
				init: function(element,options)
				{
					can.append(
						element
					,	can.view(
							steal.idToUri(options.view).path
						,	options.data
						)
					)

					/*
					this.loginForm
					=	new	Frame.Form(
							element.find('form')
						,	{
								data:	options.data.form
							,	view:	options.view_form
							}
						)
					*/
				}

			,	'.signin click': function(el,ev)
				{
					if	(!can.isFunction(this.options.onSignin))
						console.log('Error onSignin - No se proporciono una funcion')
					else
						//this.options.onSignin(this.loginForm.getData())
						this.options.onSignin(can.deparam(this.element.find('form').serialize()))
							.then(
								//	Success Sign In
								can.proxy(this.options.onSigninSuccess,this)
								//	Failed Sign In
							,	can.proxy(this.options.onSigninError,this)
							)
				}

			,	'.signup click': function(el,ev)
				{
					if	(!can.isFunction(this.options.onSignup))
						console.log('Error onSignup - No se proporciono una funcion')
					else
						this.options.onSignup()
							.then(
								//	Success Sign Up
								can.proxy(this.options.onSignupSucess,this)
								//	Failed Sign Up
							,	can.proxy(this.options.onSignupError,this)
							)	
				}

			,	'.signout click': function(el,ev)
				{
					if	(!can.isFunction(this.options.onSignup))
						console.log('Error onSignout - No se proporciono una funcion')
					else
						this.options.onSignout()
							.then(
								//	Success Sign Up
								can.proxy(this.options.onSignoutSucess,this)
								//	Failed Sign out
							,	can.proxy(this.options.onSignoutError,this)
							)	
				}
			}
		)
	}
)