define(
	[
		'lib/util'
	]
,	function()
	{
		/*
			@nombre
			Frame.Pagination
			
			@descripción

			Manejo del Paginador, renderiza un paginador.
			
			@utilización

			Se debe instanciar el controlador en un elemento html. 
		*/
		can.Control(
			'Frame.Pagination'
		,	{
				defaults:
				{
				//	Limite de items por pagina
					limit:		5
				//	Cantidad de items por defecto
				,	count:		0
				//	Cantidad de paginas a mostrar
				,	maxIndex:	5
				//	Vista del paginador
				,	view:		'views/pagination/pagiantion.mustache'
				}
			}
		,	{
			//	Inicializo la tabla
				init: function(element,options)
				{
					//	Valido que el maxIndex sea un numero impar, si no lo es, le sumo 1
					this.options.maxIndex
					=	(this.options.maxIndex % 2)
						?	this.options.maxIndex
						:	(this.options.maxIndex + 1)
					//	Genero un objeto observable para almacenar la data de la vista
					this.viewData
					=	new can.Map()
					//	Pongo que la primer pagina va a ser la 1
					this.currentPage
					=	1
					//	Seteo la pagina medio de rango
					this.middlePage
					=	Math.ceil(this.options.maxIndex/2)
					//	Creo el offset seguro segun el maxIndex
					this.safeOffset
					=	((this.options.maxIndex -1)/2)
					//	Seteo una lista con las paginas
					this.paginationPages
					=	this.getPageList()
					//	Obtengo las paginas visibles definidas por el maxIndex
					var pagesList
					=	this.getVisiblePages()
					//	Modifico el viewData con las paginas, si tengo que mostrar la lista, y si tengo que mostrar los espacios ...
					this
						.viewData
							.attr(
								{
									page:			new can.List(pagesList)
								,	show:			_.size(pagesList) > 0
								,	hidden_left:	this.isHiddenLeft()
								,	hidden_right:	this.isHiddenRight()
								}	
							)
					//	Inserto el paginador
					can.append(
						element
					,	can.view(
							options.view
						,	this.viewData
						)
					)
					//	Obtengo el UL
					this.$pages
					=	element.find('ul.pagination')
					//	Obtengo el Ir a
					this.$goTo
					=	element.find('form input[name=page]')
					//	Obtengo el select limit
					this.$itemPerPage
					=	element.find('form select[name=limit]')
					//	Activo la primer page
					this.activatePage(1)
					//	Deshabilito las paginas
					this.disablePages()
				}
			//	Inicializo las paginas del paginador
			,	initPages: function()
				{
					//	Pongo que la primer pagina va a ser la 1
					this.currentPage
					=	1
					//	Seteo una lista con las paginas
					this.paginationPages
					=	this.getPageList()
					//	Obtengo las paginas visibles definidas por el maxIndex
					var pagesList
					=	this.getVisiblePages()
					//	Modifico el viewData con las paginas, si tengo que mostrar la lista, y si tengo que mostrar los espacios ...
					this
						.viewData
							.attr(
								{
									page:			new can.List(pagesList)
								,	show:			_.size(pagesList) > 0
								,	hidden_left:	this.isHiddenLeft()
								,	hidden_right:	this.isHiddenRight()
								}	
							)
					//	Activo la primer page
					this.activatePage(1)
				}
			//	Obtengo las paginas disponibles en base al count y al limit
			,	getPageList: function()
				{
					//	Obtengo el numero de paginas dividiendo count/limit y redondeandolo hacia arriba
					var	numberOfPages
					=	Math.ceil(this.options.count/this.options.limit)
					//	Obtengo un listado de paginas, ejemplo, si numberOfPages = 5 -> listOfPages = [{page: 1}, {page: 2},...,{page: 5}]
					,	listOfPages
					=	[]
					for (var i = 0; i < numberOfPages; i++)
						listOfPages.push({pageNumber: (i+1)})
					//	Devuelvo un lista observable con las  paginas
					return	listOfPages
				}
			//	Obtengo las paginas visibles en base al medio de rango
			,	getVisiblePages: function()
				{
					var	leftOffset
					=	this.middlePage - this.safeOffset
					,	rightOffset
					=	this.middlePage + this.safeOffset

					return	_.filter(
								this.paginationPages
							,	function(page,i)
								{
									return	page.pageNumber >= leftOffset
										&&	page.pageNumber <= rightOffset
								}
							)
				}
			//	Activa la pagina
			,	activatePage: function(pageNumber)
				{
					//	Busco la pagina activa y la desactivo
					this
						.$pages
							.find('li.active')
									.removeClass('active')
					//	Busco la pagina que se pasa como argumento y la activo
					this
						.$pages
							.find('a[jump-key='+pageNumber+']')
								.parent('li')
									.addClass('active')
					//	Modficio el placeholder del Ir a
					this.$goTo.attr('placeholder',this.currentPage)
				}
			//	Valida si tengo que ocultar los ... de la izquierda
			,	isHiddenLeft: function()
				{
					return	this.currentPage > this.safeOffset
				}	
			//	Valida si tengo que ocultar los ... de la derecha
			,	isHiddenRight: function()
				{
					return	this.currentPage > this.middlePage && this.currentPage < (this.paginationPages.length - this.safeOffset)
				}
			//	Setea la pagina actual
			,	setPage: function(pageNumber)
				{
					this.middlePage
					=	(pageNumber <=	this.safeOffset)
						?	Math.ceil(this.options.maxIndex/2)
						:	(pageNumber >=	(this.paginationPages.length - this.safeOffset))
							?	this.paginationPages.length - this.safeOffset
							:	pageNumber
					//	Guardo el numero de pagina
					this.currentPage
					=	pageNumber
					//	Triggea el evento para que la tabla actualice su contenido
					this
						.element
							.trigger(
								'frame.pagination.change'
							,	{
									page:	this.currentPage
								,	limit:	this.options.limit
								}
							)
					//	Verifico que la pagina actual este en la zona segura de la izquierda
					this.viewData.attr('hidden_left',this.isHiddenLeft())
					//	Verifico que la pagina actual este en la zona segura de la derecha
					this.viewData.attr('hidden_right',this.isHiddenRight())
					//	Verifico que la pagina actual no se vaya del medio de rango
					this.viewData.attr('page',this.getVisiblePages())
					//	Activo la pagina
					this.activatePage(this.currentPage)
				}
			//	Deshabilito las paginas
			,	disablePages: function()
				{
					//	Deshabilito todos los li
					this.$pages.find('li:not(.dots)').addClass('disabled')
					//	Deshabilito el input
					this.$goTo.addClass('disabled')
					//	Deshabilito el select
					this.$itemPerPage.addClass('disabled')
				}
			//	Habilito las paginas
			,	enablePages: function()
				{
					//	Habilitos todos
					this.$pages.find('li:not(.dots)').removeClass('disabled')
					//	Deshabilito los li anterior y primero si estoy en la pagina uno
					if	(this.currentPage ==  1)
						this.$pages.find('li:not(.dots) a.jump-previous,li:not(.dots)  a.jump-first').parent('li').addClass('disabled')
					//	Deshabilito los li siguiente y ultimo si estoy en la ultima pagina
					if	(this.currentPage ==  this.paginationPages.length)
						this.$pages.find('li:not(.dots) a.jump-next,li:not(.dots)  a.jump-last').parent('li').addClass('disabled')
					//	Habilito el input
					this.$goTo.removeClass('disabled')
					//	Habilito el select
					this.$itemPerPage.removeClass('disabled')
				}
			//	Valido la pagina del input page
			,	isValidPage: function(pageNumber)
				{
					//	Valido que sea diferente a la pagina actual
					if	(pageNumber == this.currentPage)	{
						this.$goTo.parent().addClass('has-error')
						this.$goTo.tooltip({title: 'Ya se encuentra en esa página.', trigger:'manual'})
						this.$goTo.tooltip('show')
						return	false
					}
					//	Valido que sea exista la pagina
					if 	((pageNumber < 1 && pageNumber) || (pageNumber > this.paginationPages.length))	{
						this.$goTo.parent().addClass('has-error')
						this.$goTo.tooltip({title: 'Numero de página invalido.', trigger:'manual'})
						this.$goTo.tooltip('show')
						return	false
					}
					this.$goTo.parent().removeClass('has-error')
					if	(this.$goTo.data('bs.tooltip'))
						this.$goTo.tooltip('hide')
					return	true
				}
			//	Escucho cuando se oculte el tooltipo
			,	'hidden.bs.tooltip': function(el,ev)
				{
					//	Destruyo el tooltip
					this.$goTo.tooltip('destroy')
				}
			//	Escucho que se aprete la primer pagina
			,	'ul.pagination li:not(".disabled") a.jump-first click': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this.setPage(1)
				}
			//	Escucho que se aprete el boton pagina anterior
			,	'ul.pagination li:not(".disabled") a.jump-previous click': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this.setPage(this.currentPage-1)
				}
			//	Escucho que se aprete una pagina
			,	'ul.pagination li:not(".disabled") a.jump-to click': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this.setPage(parseInt(can.$(el).attr('jump-key')))
				}
			//	Escucho que se aprete el boton pagina siguiente
			,	'ul.pagination li:not(".disabled") a.jump-next click': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this.setPage(this.currentPage+1)
				}
			//	Escucho que se aprete la ultima pagina
			,	'ul.pagination li:not(".disabled") a.jump-last click': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this.setPage(this.paginationPages.length)
				}
			//	Escucho que cambie el valor del input page
			,	'form input[name=page] change': function(el,ev)
				{
					//	Valido que la pagina sea valida
					if	(this.isValidPage(parseInt(can.$(el).val())))	{
						//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
						this.disablePages()
						//	Triggeo el cambio de pagina
						this.setPage(parseInt(can.$(el).val()))
					}
				}
			//	Escucho que cambie el valor del select limi
			,	'form select[name=limit] change': function(el,ev)
				{
					//	Deshabilito todos los li para evitar que vuelvan apretar una pagina y se envieen varias peticiones
					this.disablePages()
					//	Triggeo el cambio de pagina
					this
						.element
							.trigger(
								'frame.pagination.change'
							,	{
									page:	1
								,	limit:	parseInt(can.$(el).val())
								}
							)
				}
			//	Escucho si se actualizo la tabla
			,	'frame.table.updated': function(el,ev,response)
				{
					//	Verifico si cambio el count
					if	(!_.isEqual(response.count,this.options.count) || !_.isEqual(response.limit,this.options.limit))	{
						//	Actualizo el valor del count
						this.options.count
						=	response.count
						//	Actualizo el valor del limite
						this.options.limit
						=	response.limit
						//	Inicializo las paginas del paginador
						this.initPages()
					}
					//	Habilito las paginas
					this.enablePages()
				}
			}
		)
	}
)