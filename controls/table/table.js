define(
	[
		'lib/util'
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
					view:		false
				,	data:		[]
				,	filter:		undefined
				,	pagination:	undefined
				}
			}
		,	{
				init: function(element,options)
				{
					//	Agrego la clase panel a la tabla
					element
						.addClass('panel panel-default')
					//	Creo un objeto observable que contendra los datos de la Tabla (Obtengo bindeos al modificar este objeto)
					this.tableData
					=	new can.Map({count: 1, data: []})
					//	Creo los elementos HTML que contendran el filtro, la tabla y el paginador
					//	Verifico si tiene filtro
					if	(!_.isUndefined(this.options.filter))
						this.$filterContent
						=	can.$('<div>')
								.addClass('panel-heading')
								.appendTo(this.element)
					//	Inserto el contenedor de la tabla
					this.$tableContent
					=	can.$('<div>')
							.addClass('panel-body')
							.appendTo(this.element)
					//	Verifico si tiene paginador
					if	(!_.isUndefined(this.options.pagination))
						this.$paginationContent
						=	can.$('<div>')
								.addClass('panel-footer')
								.appendTo(this.element)
					//	Renderizo el Filtro
					this._render_filter()
					//	Renderizo la Tabla
					this._render_table()
					//	Renderizo el Paginador
					this._render_pagination()
				}
			//	Renderizo el Filtro
			,	_render_filter: function()
				{
					//	Instancio el filtro
					new Frame.Filter(
						this.$filterContent
					,	this.options.filter
					)
				}
			//	Renderizo la Tabla
			,	_render_table: function()
				{
					//	Agrego la Tabla
					can.append(
						this.$tableContent
					,	can.view(
							this.options.view
						,	this.tableData
						)
					)
				}
			//	Renderizo el Paginador
			,	_render_pagination: function()
				{
					//	Instancio el paginador
					new	Frame.Pagination(
						this.$paginationContent
					,	can.extend(
							this.options.pagination
						,	{
								count:	this.tableData.attr('count')
							}
						)
					)
				}
			//	Actualizo la data de la tabla
			,	updateData: function(count,data)
				{
					//	Actualizo el objeto observable
					this
						.tableData
							.attr(
								{
									count:	count
								,	data:	data
								}
							)
				}
			}
		)
	}
)