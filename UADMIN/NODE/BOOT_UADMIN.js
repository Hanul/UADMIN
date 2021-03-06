/**
 * boot UADMIN.
 */
global.BOOT_UADMIN = METHOD({

	run : function() {
		'use strict';
		
		var
		// session store
		sessionStore = SHARED_STORE('sessionStore'),
		
		// model map
		modelMap = {},
		
		// model name map
		modelNameMap = {},
		
		// uri matcher
		uriMatcher = URI_MATCHER('__/{boxName}/{modelName}/{method}'),
		
		// UADMIN server
		uadminServer;
		
		UADMIN_CONFIG.init(function(model) {
			
			var
			// box name
			boxName = model.getBoxName(),
			
			// models
			models = modelMap[boxName],
			
			// name
			name = model.getName();
			
			if (models === undefined) {
				models = modelMap[boxName] = {};
				modelNameMap[boxName] = [];
			}
			
			models[name] = model;
			modelNameMap[boxName].push(name);
		});
		
		uadminServer = WEB_SERVER({

			port : UADMIN_CONFIG.port,
			
			rootPath : UPPERCASE_PATH + '/UADMIN',

			version : CONFIG.version
		}, {

			requestListener : function(requestInfo, nativeResponse, replaceRootPath, next) {
				
				var
				// uri
				uri = requestInfo.uri,
				
				// session key
				sessionKey = requestInfo.cookies.__SESSION_KEY,
	
				// session
				session,
				
				// password
				password,
				
				// match info
				matchInfo,
				
				// uri params
				uriParams,
				
				// models
				models,
				
				// model
				model,
				
				// response.
				response = function(content) {
					nativeResponse({
						content : content,
						headers : sessionKey !== undefined ? undefined : {
							'Set-Cookie' : CREATE_COOKIE_STR_ARRAY({
								__SESSION_KEY : RANDOM_STR(40)
							})
						}
					});
				};
				
				if (uri === '__LOGIN') {
					
					if (sessionKey !== undefined && requestInfo.data.password === UADMIN_CONFIG.password) {
						sessionStore.save({
							id : sessionKey,
							data : {
								password : requestInfo.data.password
							},
							removeAfterSeconds : 30 * 60 // 30 minutes
						});
						response('true');
					} else {
						response('false');
					}
					
					return false;
				}
				
				if (uri === '__LOGOUT') {
					
					if (sessionKey !== undefined) {
						sessionStore.remove(sessionKey);
					}
					
					response('true');
					
					return false;
				}
				
				if (sessionKey !== undefined) {
					session = sessionStore.get(sessionKey);
					if (session !== undefined) {
						password = session.password;
					}
				}
				
				if (password !== UADMIN_CONFIG.password) {
					
					// serve login page.
					if (uri === '') {
						
						READ_FILE(UPPERCASE_PATH + '/UADMIN/login.html', function(content) {
							response(content.toString());
						});
						
						return false;
					}
					
				} else {
					
					// serve system info.
					if (uri === '__SYSTEM_INFO') {
						
						response(STRINGIFY({
							cpus : CPU_USAGES(),
							memory : MEMORY_USAGE(),
							workerId : CPU_CLUSTERING.getWorkerId(),
							pid : process.pid
						}));
						
						return false;
					}
					
					// serve store storages.
					if (uri === '__SHARED_STORE_STORAGES') {
						
						nativeResponse({
							contentType : 'application/json',
							content : STRINGIFY(SHARED_STORE.getStorages())
						});
						
						return false;
					}
					
					// serve db storages.
					if (uri === '__SHARED_STORE_STORAGES') {
						
						nativeResponse({
							contentType : 'application/json',
							content : STRINGIFY(SHARED_STORE.getStorages())
						});
						
						return false;
					}
					
					// serve model naem map.
					else if (uri === '__MODEL_NAME_MAP') {
						
						response(STRINGIFY(modelNameMap));
						
						return false;
					}
					
					matchInfo = uriMatcher.check(uri);
					
					// serve model funcs.
					if (matchInfo.checkIsMatched() === true) {
						
						uriParams = matchInfo.getURIParams();
						
						models = modelMap[uriParams.boxName];
						
						if (models !== undefined) {
							
							model = models[uriParams.modelName];
							
							if (model !== undefined) {
								
								if (uriParams.method === '__GET_CREATE_VALID_DATA_SET') {
									
									if (model.getCreateValid() === undefined) {
										
										response('');
										
									} else {
										
										response(STRINGIFY(model.getCreateValid().getValidDataSet()));
									}
								}
								
								else if (uriParams.method === '__GET_UPDATE_VALID_DATA_SET') {
									
									if (model.getUpdateValid() === undefined) {
										
										response('');
										
									} else {
										
										response(STRINGIFY(model.getUpdateValid().getValidDataSet()));
									}
								}
								
								else if (uriParams.method === '__GET_VALID_DATA_SET') {
									
									if (model.getCreateValid() === undefined && model.getUpdateValid() === undefined) {
										
										response('');
										
									} else if (model.getCreateValid() === undefined) {
										
										response(STRINGIFY(model.getUpdateValid().getValidDataSet()));
										
									} else if (model.getUpdateValid() === undefined) {
										
										response(STRINGIFY(model.getCreateValid().getValidDataSet()));
									
									} else {
										response(STRINGIFY(COMBINE([model.getUpdateValid().getValidDataSet(), model.getCreateValid().getValidDataSet()])));
									}
								}
								
								else if (uriParams.method === 'create' && model.create !== undefined) {
								
									model.create(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										notValid : function(validErrors) {
											response(STRINGIFY({
												validErrors : validErrors
											}));
										},
										success : function(savedData) {
											response(STRINGIFY({
												savedData : savedData
											}));
										}
									});
									
									return false;
								}
								
								else if (uriParams.method === 'get' && model.get !== undefined) {
								
									model.get(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										success : function(savedData) {
											response(STRINGIFY({
												savedData : savedData
											}));
										}
									});
									
									return false;
								}
								
								else if (uriParams.method === 'update' && model.update !== undefined) {
								
									model.update(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										notValid : function(validErrors) {
											response(STRINGIFY({
												validErrors : validErrors
											}));
										},
										success : function(savedData, originData) {
											response(STRINGIFY({
												savedData : savedData,
												originData: originData
											}));
										}
									});
									
									return false;
								}
								
								else if (uriParams.method === 'remove' && model.remove !== undefined) {
								
									model.remove(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										success : function(originData) {
											response(STRINGIFY({
												originData: originData
											}));
										}
									});
									
									return false;
								}
								
								else if (uriParams.method === 'find' && model.find !== undefined) {
									
									if (requestInfo.data !== undefined && requestInfo.data.filter !== undefined) {
										
										EACH(requestInfo.data.filter, function(value, name) {
											
											var
											// type
											type;
											
											if (value === '' || value === false) {
												delete requestInfo.data.filter[name];
											}
											
											else if (name === 'id' || value === true || VALID.real(value) === true) {
												
												if (name.indexOf('$') !== -1) {
													
													delete requestInfo.data.filter[name];
													type = name.substring(name.indexOf('$') + 1);
													name = name.substring(0, name.indexOf('$'));
													
													if (requestInfo.data.filter[name] === undefined) {
														requestInfo.data.filter[name] = {};
													}
													
													if (type === 'start') {
														requestInfo.data.filter[name].$gte = REAL(value);
													} else if (type === 'end') {
														requestInfo.data.filter[name].$lte = REAL(value);
													}
												}
												
												else {
													requestInfo.data.filter[name] = value;
												}
											}
											
											else if (value !== false) {
												
												if (name.indexOf('$') !== -1) {
													
													delete requestInfo.data.filter[name];
													type = name.substring(name.indexOf('$') + 1);
													name = name.substring(0, name.indexOf('$'));
													
													if (requestInfo.data.filter[name] === undefined) {
														requestInfo.data.filter[name] = {};
													}
													
													if (type === 'start') {
														requestInfo.data.filter[name].$gte = new Date(value);
													} else if (type === 'end') {
														requestInfo.data.filter[name].$lte = new Date(value);
													}
												}
												
												else {
													requestInfo.data.filter[name] = new RegExp(value, 'g');
												}
											}
										});
									}
									
									model.find(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										success : function(savedDataSet) {
											response(STRINGIFY({
												savedDataSet : savedDataSet
											}));
										}
									});
									
									return false;
								}
								
								else if (uriParams.method === 'count' && model.count !== undefined) {
								
									model.count(requestInfo.data, {
										error : function(errorMsg) {
											response(STRINGIFY({
												errorMsg : errorMsg
											}));
										},
										success : function(count) {
											response(STRINGIFY({
												count : count
											}));
										}
									});
									
									return false;
								}
							}
						}
					}
				}
			},
			
			notExistsResource : function(resourcePath, requestInfo, response) {
				
				var
				// session key
				sessionKey = requestInfo.cookies.__SESSION_KEY,
				
				// session
				session,
				
				// password
				password;
				
				if (sessionKey !== undefined) {
					session = sessionStore.get(sessionKey);
					if (session !== undefined) {
						password = session.password;
					}
				}
				
				if (password !== UADMIN_CONFIG.password) {
					
					READ_FILE(UPPERCASE_PATH + '/UADMIN/login.html', function(content) {
						response(content.toString());
					});
					
				} else {
				
					READ_FILE(UPPERCASE_PATH + '/UADMIN/index.html', function(content) {
						response(content.toString());
					});
				}
				
				return false;
			}
		});
		
		console.log('[UPPERCASE] UADMIN Tool BOOTed! => http://localhost:' + UADMIN_CONFIG.port);
	}
});
