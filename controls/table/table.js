define(
	[
		'lib/util'
	]
,	function(){
		can.Control('TableControl'
			,{
				defaults:{
					view_filter: false
				,	view_table: false
				,	data: []
				}
			
			},{
				
				init: function(element,options){

					can.append(
						this.element
					,	can.view(
							this.options.view_filter
						)
					)
					
					if (typeof options.data == 'object')
						this.agregarDatos(options.data)
					else
						if (can.isDeferred(options.data()))
							options.data().then(can.proxy(this.agregarDatos,this))
						else
							if (options.data() instanceof can.Model)
								options.data.aDeferred().then(can.proxy(this.agregarDatos,this))

					this.configTable()
				
				}
				
			,	configTable: function(){
					var $table = this.element.find('table')

					$table.addClass(this.options.class)
					$table.addClass(this.options.type)
					if (this.options.id)
						$table.attr('id', this.options,id)
				}

			,	agregarDatos: function(data){
					can.append(
						this.element,
						can.view(
							this.options.view_table 
						,	data
						)
					)
				}

			,	'.filter click': function(el, ev) {
					can.$('body').find('#table1').remove()

					this.options.data.filter(2).then(can.proxy(this.agregarDatos,this))
				}
			}
		)
	}
)