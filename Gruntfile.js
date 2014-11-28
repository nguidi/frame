module.exports
=	function(grunt)
	{
//		grunt
//			.loadNpmTasks(
//				'documentjs'
//			)
		
		grunt
			.loadNpmTasks(
				'steal-tools'
			)
		
		grunt
			.initConfig(
				{
					stealBuild:
					{
						default:
						{
							options:
							{
								system:
								{
									main:	'frame'
								,	config:	__dirname+'/stealconfig.js'
								}
							}
						}
					}
//				,	documentjs:
//					{
//    					versions:
//						{
//							"1.0.0":	"https://github.com/nguidi/frame"
//						}
//					,	sites:
//						{
//							docs:
//							{
//								glob:	'lib/**/*.js'
//							,	out:	'api'
//							}
//						}
//					}
				}
		)

		grunt
			.registerTask(
				'build'
			,	[
					'stealBuild'
//				,	'documentjs'
				]
			)
	}