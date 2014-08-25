define(
	[
		'lib/util'
	//	Cargo el paginador
	,	'controls/pagination/pagination'
	]
,	function()
	{
		/*
			@nombre
			Frame.Table
			
			@descripción

			Manejo de Tablas, renderiza una tabla apartir de una vista proporcionada o bien desde un mach objeto valor de los items a mostrar.
			
			@utilización

			Se debe instanciar el controlador en un elemento html. 
		*/
		can.Control(
			'Frame.Table'
		,	{
				defaults:
				{
				//	Vista de la tabla
					view:		false
				//	Vista del paginador
				,	view_pagination:	'views/pagination/pagiantion.mustache'
				//	Modelo asociado a la tabla
				,	model:		undefined
				//	Configuracion del paginador
				,	pagination:
					{
						limit:		5
					,	skip:		0
					,	maxIdenx:	5
					}
				//	Sort por defecto
				,	sort:		undefined
				//	Funcion a llamar antes de obtener los registros
				,	beforeSend:	undefined
				//	Booleano que determina si voy a autocompletar la tabla con datos la primera vez que inicie
				,	autoFill:	true
				//	Mensaje de error por defecto
				,	defaultErrorMsg:	'Ocurrio un error. <br> Intente nuevamente.'
				}
			}
		,	{
			//	Inicializo la tabla
				init: function(element,options)
				{
					//	Configuraciones de la instancia del controlador
					//	Configuro el limite de registros por pagina				
					this.tableLimit
					=	options.pagination.limit
					//	Configuro la cantidad de registros a omitir
					this.tableSkip
					=	options.pagination.skip
					//	Configuro el sort que tendran los registros
					this.tableSort
					=	options.sort
					//	Configuro una lista vacia que se van a mostrar
					this.tableData
					=	new	can.Map()
					//	Inserto la tabla (puede tener de forma opcional un formulario para busquedas)
					can.append(
						element
					,	can.view(
							options.view
						,	this.tableData
						)
					)
					//	Obtengo los registros
					this
						.options
							.model
								.findAll(
									{
										where:	this.getQuery()
									,	limit:	this.tableLimit
									,	skip:	this.tableSkip
									,	sort:	this.tableSort
									}
								).then(
									can.proxy(this.setInitialData,this)
								)
				}

			,	setInitialData: function(response)
				{
					//	Agrego el paginador
					this.paginationControl
					=	new	Frame.Pagination(
							this.element
						,	{
							//	Limite de items por pagina (por defecto 5)
								limit:		this.options.pagination.limit
							//	Cantidad de items a paginar (por defecto 0)
							,	count:		response.count
							//	Cantidad de indices a mostrar (por defecto 5)
							,	maxIndex:	this.options.pagination.maxIndex
							//	Vista del paginador
							,	view:		this.options.view_pagination
							}
						)
					//	Agrego los registros a la tabla
					this.updateTable(response)
				}
			//	Obtiene los registros
			,	getRecords: function(callback)
				{
					return	this
								.options
									.model
										.findAll(
											{
												where:	this.getQuery()
											,	limit:	this.tableLimit
											,	skip:	this.tableSkip
											,	sort:	this.tableSort
											}
										).then(
											can.proxy(this.updateTable,this)
										,	can.proxy(this.notifyError,this)
										).always(
											callback
										)
				}
			/*
				Obtiene la query a enviar

				Verbo a utilizar			Equivalencia en SQL
				
				'lessThan'				=>	'<' 
				'lessThanOrEqual'		=>	'<='
				'greaterThan'			=>	'>'
				'greaterThanOrEqual'	=>	'>=' 
				'not'					=>	'!'
				'like'					=>	'%'	
				'contains'				=>	'%L%'	
				'startsWith'			=>	'L%'
				'endsWith'				=>	'%L'	
			*/
			,	getQuery: function()
				{
					var	$form
					=	this.element.find('form#searchItems')
					//	Recorro los atributos del formulario
					return	_.mapValues(
								can.getFormData(
									$form
								)
							,	function(value,key)
								{
									//	Busco el campo
									var	$field
									=	$form.find('[name='+key+']')
									//	Devuelvo la query para el atributo.
									/*
										Ejemplos:
											si attr-query = ""		->	valorCampo
											Si attr-query = "not"	->	{ not: valorCampo}
									*/ 
									return	_.isEmpty($field.attr('attr-query'))
											?	value
											:	_.object(
													[$field.attr('attr-query')]
												,	[value]
												)
								}
							)

				}
			//	Actualizo la tabla
			,	updateTable: function(response)
				{
					//	Remplazo los registros de la tabla por los nuevos registros
					this
						.tableData
							.attr(
								response
							)
					//	Aviso que se actualizo la tabla
					this
						.element
							.trigger(
								'frame.table.updated'
							,	_.extend(
									response
								,	{
										limit:	this.tableLimit
									}
								)
							)
				}
			//	Si ocurrio un error lo notifico
			,	notifyError: function()
				{
					//	Triggeo un evento para que el notify muestre un mensaje de error
					this
						.element
							.trigger(
								'frame.notify.danger'
							,	this.options.defaultErrorMsg
							)
				}
			//	Invierte el tipo de sort (HORRIBLE)
			,	inverseSortI: function($i)
				{
					//	Si es alfanumerico
					if	($i.hasClass('fa-sort-alpha-asc'))
						$i
							.removeClass('fa-sort-alpha-asc')
							.addClass('fa-sort-alpha-desc')
					else
						if	($i.hasClass('fa-sort-alpha-desc'))
							$i
								.removeClass('fa-sort-alpha-desc')
								.addClass('fa-sort-alpha-asc')
					//	Si es de cantidad
					if	($i.hasClass('fa-sort-amount-asc'))
						$i
							.removeClass('fa-sort-amount-asc')
							.addClass('fa-sort-amount-desc')
					else
						if	($i.hasClass('fa-sort-amount-desc'))
							$i
								.removeClass('fa-sort-amount-desc')
								.addClass('fa-sort-amount-asc')
					//	Si es numerico
					if	($i.hasClass('fa-sort-numeric-asc'))
						$i
							.removeClass('fa-sort-numeric-asc')
							.addClass('fa-sort-numeric-desc')
					else
						if	($i.hasClass('fa-sort-numeric-desc'))
							$i
								.removeClass('fa-sort-numeric-desc')
								.addClass('fa-sort-numeric-asc')
					//	Si es generico
					if	($i.hasClass('fa-sort-asc'))
						$i
							.removeClass('fa-sort-asc')
							.addClass('fa-sort-desc')
					else
						if	($i.hasClass('fa-sort-desc'))
							$i
								.removeClass('fa-sort-desc')
								.addClass('fa-sort-asc')
				}
			//	Si apreto algun boton de sort
			,	'table thead th .sort-table click': function(el,ev)
				{
					//	Obtengo el orden de sort (Por defecto DESC)
					var	sortOrder
					=	can.$(el).attr('class').indexOf("asc") > -1
						?	"ASC"
						:	"DESC"
					//	Obtengo el nombre del atributo a ordenar
					,	attrName
					=	can.$(el).parent('th').attr('attr-name')
					//	Invierto la imagen del SORT
					this.inverseSortI(can.$(el))
					//	Actualizo el sort
					this.tableSort
					=	attrName+' '+sortOrder
					//	Actualizo la tabla con el nuevo orden
					this.getRecords()
				}
			//	Si cambio la paginacion
			,	'frame.pagination.change': function(el,ev,data)
				{
					//	Actualizo la configuracion del limite de registros a obtener
					this.tableLimit
					=	data.limit
					//	Actualizo la configuracion de la cantidad de registros a omitir
					this.tableSkip
					=	(data.page - 1)*data.limit
					//	Obtengo los registros
					this
						.getRecords()
				}
			//	Si se aperto el boton de buscar nuevos registros
			,	'button.search-records click': function(el,ev)
				{
					//	Pongo el boton en modo loading
					can.$(el)
						.button('loading')
					//	Busco los nuevos registros y pongo un callback para resetear el boton de buscar
					this
						.getRecords(
							function()
							{
								//	Reseteo el boton de buscar
								can.$(el)
									.button('reset')								
							}
						)
				}
			}
		)
	}
)