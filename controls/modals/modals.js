define(
	[
		'lib/util'
	,	'draggabilly'
	]
,	function(util,Draggabilly)
	{
		/*
			@nombre
			Frame.Modal
			
			@descripción

			Manejo de ventanas modales mediante eventos. Implica creacion, encolar ventanas y destruirlas.
			
			@utilización

			Se debe instanciar el controlador en un elemento html, los eventos deben de surgir de hijos de este elemento.

		*/
		can.Control(
			'Frame.Modal'
		,	{
				defaults:{}
			}
		,	{
				init: function(element,options)
				{
					/*
						Cola LIFO para modals. La idea es que me permita generar modals encadenados.
						[
							{
								element:	modal_jquery_element
							,	options:	modal_options
							,	id:			modal_id
							,	data:		modal_data
							}
						,	...
						]	
					*/
					this.modalsLIFO = new can.List([])	//	Observable! Al ser observable puedo escuchar cambios en la lista, por ejemplo, cuando se agrega un nuevo objeto ("add").

					this
						.modalsLIFO
							.bind(
								'add'					//	Si agrego un elemento, ejecuto newModal
							,	can.proxy(this.newModal,this)
							)

					this
						.modalsLIFO							
							.bind(
								'remove'				//	Si quito un elemento, ejecuto removeModal
							,	can.proxy(this.removeModal,this)
							)
				}

			,	newModal: function(ev,newModals,index)	//	Ev ("add"), newModal (elemento agregado a la lista), index (Posicion en la lista).
				{
					if	(index == 0)					//	verifico si es el unico modal (Por ende, no hay ninguno visible en este momento).
						this._render_bg_modal()			//	renderizo el background del modal.
					else
						this.hideModal(index)			//	Oculto el modal que esta en el indice anterior del LIFO

					this._render_modal(newModals[0])	//	Pregunto por el newModals[0] porque devuelve un array con los elementos agregados. renderizo el modal.
				}

			,	removeModal: function(ev,modals,index)	//	Ev (Evento "add"), modal (elemento removido de la lista), index (posicion que ocupaba).
				{
					modals[0].element.remove()			//	Pregunto por modals[0], porque devuelve un array con los elmentos removidos. Elimino el modal

					if	(index == 0)					//	Verifico que el modal ocupaba la primera posicion, si es asi, es el unico, por ende, elimino el bg.
						this.$modal_bg.remove()
					else
						this.showModal(index)
				}
			
			,	_render_bg_modal: function()			//	Renderizo el bg, el bg es una pantalla gris que bloquea la interaccion detras del modal.
				{
					this.$modal_bg
					=	can.$('<div>')
							.addClass('modal-backdrop in')
							.css('display','block')
							.appendTo(
								this.element
							)
				}

			,	hideModal: function(index)
				{
					var	currentModal
					=	this.modalsLIFO.attr(index-1)

					currentModal						//	Cambio el estilo display para poder ocultarlo en pantalla
						.element
							.css(
								{
									'display':		'none'
								}
							)
				}

			,	showModal: function(index)
				{
					var	currentModal
					=	this.modalsLIFO.attr(index-1)

					currentModal						//	Cambio el estilo display para poder mostrarlo en pantalla
						.element
							.css(
								{
									'display':		'block'
								}
							)
				}

			,	_render_modal: function(modal)
				{
					can.append(								//	Lo agrego al elemento html donde esta instanciado el control de Modal.
						this.element
					,	modal.element
					)

					modal.element.data('modal',modal)		//	seteo el objeto del modal en el html para leerlo mas tarde.

					new	Draggabilly(						//	Permite que el modal se lo pueda arrastrar por la pantalla (Drag).
						modal.element[0]					//	El Draggabilly no utiliza jQuery asi que el selector de jquery no funciona con el
					,	{									//	Al hacer modal.element[0] devuelvo el elemento puro (http://draggabilly.desandro.com/)
							containment: 'body'				//	El contenedor de donde no se puede escapar al se drageado
						,	handle: '.modal-header'			//	De donde se puede agarrar el modal para arrastrarlo
						}
					)

					modal
						.element							//	Agrego los estilos que le faltan al contenedor del modal
							.css(
								{
									'display':		'block'
								,	'right':		'auto'
								,	'left':			'auto'
								,	'bottom':		'auto'
								,	'overflow':		'auto'
								,	'position':		'fixed'
								,	'width':		'100%'
								}
							)

					modal									//	Agrege el tamaño al modal
						.element
							.find('.modal-dialog')
								.css(
									'width',this.getWidth(modal)	//	Obtengo el ancho del modal en base a su atributo size
								)

					if	(can.isFunction(modal.options.onRender))	//	Si tiene la funcion onRender declarada la llamo (Funcion a llamar una ves que se renderizo el modal)
						modal.options.onRender(modal.element)
				}

			,	getWidth: function(modal)			// desde el modal, obtengo su tamaño, lo calculo en pixeles y le agrego un margen.
				{
					switch(modal.options.size)
					{
						case 'xs':
							size = 400
							break
						case 's':
							size = 600
							break
						case 'm':
							size = 800
							break
						case 'l':
							size = 1000
							break
						case 'xl':
							size = 1200
							break;
						default:
							size = 700
					}

					return	size+'px'
				}

			,	destroyModal: function()
				{
					this.modalsLIFO.pop()					//	Quito el ultimo elemento de la lista (LIFO).
				}

			,	'.app-modal .close-modal click': function(el,ev)	//	Escucho que se presione el boton
				{
					ev.stopPropagation()					//	dentengo la propagacion del evento, en caso de que alguien mas lo escuche.
					ev.preventDefault()						//	esto es preventivo, si lo de arriba no funca.

					this.destroyModal()
				}

			,	'.app-modal .discard-modal click': function(el,ev)	//	Escucho que se aprete el boton discard-modal, llamo a destroyModal.	
				{
					this.destroyModal()	
				}

			,	'.app-modal .confirm-modal click': function(el,ev)	//	Escucho que se aprete el boton confirm-modal
				{
					var	modal										//	Como setee la data del modal en el elemento HTML, la busco y la obtengo.
					=	can.$(el).parents('.app-modal').data('modal')

					if	(can.isFunction(modal.options.onConfirm))	//	Verifico si tengo seteado una funcion onConfirm y si es asi la llamo.
						modal.options.onConfirm(modal.element,modal.data)
				}

			,	'frame.modal.new': function(el,ev,options)	//	el (Lugar donde se disparo el evento), ev (el evento), options (parametros del nuevo modal)
				{
					ev.preventDefault()						//	Detengo el evento, por si existe algun otro modal en un parent del elemento que contiene la instancia actual.
					ev.stopPropagation() 

					var	$modalParent						//	creo un elemento html para utilzarlo como padre de el modal y poder insertar elementos dentro.	
					=	can.$('<div>')
					,	modal								//	variable para mi nuevo modal que voy a terminar agregando a la LIFO
					=	{
							id:		options.id
						,	data:	options.data
						}

					delete	options.id						//	Elimino los atributos para limpiar las options	
					delete	options.data

					can.append(
						$modalParent
					,	can.view(
							options.view
						,	modal
						)
					)

					var	$modalElement
					=	$modalParent.children()				//	Como mi modal es el unico hijo del div que cree antes, lo obtengo.

					$modalElement 							//	Le agrego una clase para referenciarlo en los eventos
						.addClass('app-modal')

					can.extend(								// Extiendo mi variable modal con nuevos datos
						modal
					,	{
							element:	$modalElement
						,	options:	options
						}
					)

					this.modalsLIFO.push(modal)				//	agrego el modal al LIFO
				}
			}
		)
	}
)