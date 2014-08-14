define(
	[
		'lib/util'
	,	'controls/form/form'
	]
,	function()
	{
		/*
			@nombre
			Frame.Filter
			
			@descripción

			Genera un formulario para ser utilizado como filtro y crea query al submitear el formulario
			
			@utilización

			Se debe instanciar el controlador en un elemento html. 
			El controlador lanzara un evento indicando la query.
		*/
		can.Control(
			'Frame.Filter'
		,	{
				defaults:
				{
					view:		false
				,	data:		[]
				,	quickSearch:
					[
						{
							name:	'quickSearch'
						,	type:	'text'
						,	addons:
							[
								{
									position:	'append'
								,	type:		'buton'
								,	name:		'search'
								,	submit:		true
								,	label:		'Buscar'
								}
							,	{
									position:	'append'
								,	type:		'button'
								,	name:		'more'
								,	icon:		'fa-chevron-down'
								,	'class':	'text-info'
								}
							]
						}
					]
				,	advancedSearch:	undefined
				}
			}
		,	{
				init: function(element,options)
				{
					new	Frame.Form(
						'#inline-form-demo'
					,	{
							type:		'inline'
						,	data:		this.options.quickSearch
						,	onSubmit:	can.proxy(this.submitSearch,this)
						}
					)
				}
			//	Escucha que se presione el boton more. Si se apreta el boton muestra o oculta la busqueda avanzada
			,	'button[name=more] click': function(el,ev)
				{
					this
						.element
							.find('[name=search]')
					//	Obtengo el boton
					can.$(el)
						//	Cambio la clase text-info por text-success o biseversa
						.toggleClass('text-info text-success')
						//	Cambio la clase fa-chevron-down por fa-chevron-up o biseversa
						.toggleClass('fa-chevron-down fa-chevron-up')
					//	Muestro o oculto el advanced search
					this
						.$advancedSearch
							.toggle()
				}

			,	getQuery: function(formData)
				{

				}

			,	submitSearch: function(formData)
				{
					can.trigger(
						this.element
					,	'frame.filter.search'
					,	this.getQuery(formData)
					)
				}
			}
		)
	}
)