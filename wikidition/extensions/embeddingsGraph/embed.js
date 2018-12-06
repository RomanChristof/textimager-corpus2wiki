$(document).ready(function() {
var rest_endpoint = "http://hydra.hucompute.org:5000/api/v1/nn";

var showLabelIsChecked = true;
var showArrowIsChecked = false;
var threshholdFilterValue = 50;
var selectedNode = null;

		var try_get_ddc_color = function(node) {
			if (node.colors && node.colors.ddc && node.colors.ddc.length>0 && node.colors.ddc[0].length>0)
				return node.colors.ddc[0][1][0];
			return node.colors.normal;
		}

		var try_get_ddc_color_muted = function(node) {
			if (node.colors && node.colors.ddc && node.colors.ddc.length>0 && node.colors.ddc[0].length>0)
				return node.colors.ddc[0][1][1];
			return node.colors.normal;
		}

		$(document).ready(function () {
			var generate_graph = function(words, embeddings, word_pos, elem,width,height, maxn, thr) {
				
				threshholdFilterValue = Number(thr);

				$.ajax({
					method: "POST",
					contentType: "application/json",
					dataType: "json",
					url: rest_endpoint,
					data: JSON.stringify({
						"embeddings": embeddings,
						"words": words,
						"pos": word_pos,
						"maxn": maxn
					})
				})
				.done(function (jqXHR, textStatus, errorThrown) {
					$.each(jqXHR, function(index, element) {
						// remove dots from id...
						var oldIndex = index;
						index = index.replace(/\./g, '_');

							var tmpIndex = 0;
							var seedWords = [];
							element.nodes.forEach(function(d, i){
									// if(!(d.id in labelIdMap)){
									//     labelIdMap[d.id] = tmpIndex++;
									// }
									// d.id = labelIdMap[d.id];
									// d.val = 1;
									if(d.is_seed_word){
											seedWords.push(d.id);
											//d.color=d.colors.seed_word;
									}
									else {
											//d.color=d.colors.normal;
									}
							})
							var adjacentMap = {};
							var nodeWidthHeightMap = {};
							var minLinkValue = 1;
							var maxLinkValue = 0;
							
							var minLinkValue2 = 1;
							var maxLinkValue2 = 0;

							element.links.forEach(function(d, i){
								if(d.source in adjacentMap){
									adjacentMap[d.source].add(d.target);
								}
								else{
									adjacentMap[d.source] = new Set();
									adjacentMap[d.source].add(d.target);

								}
								if(d.target in adjacentMap){
									adjacentMap[d.target].add(d.source);
								}
								else{
									adjacentMap[d.target] = new Set();
									adjacentMap[d.target].add(d.source);
								}

								if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
										if(d.value>maxLinkValue)
												maxLinkValue=d.value
										if(d.value<minLinkValue)
												minLinkValue=d.value
								}

								
								if(d.value>maxLinkValue2)
										maxLinkValue2=d.value;
								if(d.value<minLinkValue2)
										minLinkValue2=d.value;

								if(d.target in nodeWidthHeightMap){
										if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
												nodeWidthHeightMap[d.target]["width"] = nodeWidthHeightMap[d.target]["width"]+d.value;
												nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
												nodeWidthHeightMap[d.target]["neighbours"] = nodeWidthHeightMap[d.target]["neighbours"]+1;
												nodeWidthHeightMap[d.target]["seedNeighbours"] = nodeWidthHeightMap[d.target]["seedNeighbours"]+1;
										}
										else{
												nodeWidthHeightMap[d.target]["height"] = nodeWidthHeightMap[d.target]["height"]+d.value;
												nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
												nodeWidthHeightMap[d.target]["neighbours"] = nodeWidthHeightMap[d.target]["neighbours"]+1;
										}
								}
								else{
										if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
												nodeWidthHeightMap[d.target] = {width: (1+d.value), width_count: 1, height:1, neighbours:1, seedNeighbours:1};
										}
										else{
												nodeWidthHeightMap[d.target] = {width: 1, width_count: 1, height:(1+d.value), neighbours:1, seedNeighbours:1};
										}
								}

								if(d.source in nodeWidthHeightMap){
										if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
												nodeWidthHeightMap[d.source]["width"] = nodeWidthHeightMap[d.source]["width"]+d.value;
												nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
												nodeWidthHeightMap[d.source]["neighbours"] = nodeWidthHeightMap[d.source]["neighbours"]+1;
												nodeWidthHeightMap[d.source]["seedNeighbours"] = nodeWidthHeightMap[d.source]["seedNeighbours"]+1;
										}
										else{
											nodeWidthHeightMap[d.source]["height"] = nodeWidthHeightMap[d.source]["height"]+d.value;
											nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
											nodeWidthHeightMap[d.source]["neighbours"] = nodeWidthHeightMap[d.source]["neighbours"]+1;
										}
								}
								else{
										if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
												nodeWidthHeightMap[d.source] = {width: (1+d.value), width_count: 1, height:1, neighbours:1, seedNeighbours:1};
										}
										else{
												nodeWidthHeightMap[d.source] = {width: 1, width_count: 1, height:(1+d.value), neighbours:1, seedNeighbours:1};
										}
								}

								for(var i in seedWords){
										var tmpSeedWord = seedWords[i];
										nodeWidthHeightMap[tmpSeedWord] = {width: seedWords.length, height:seedWords.length, neighbours:(nodeWidthHeightMap.length-seedWords.length)};

								}

							})

							var in_min = minLinkValue2;
							var in_max = maxLinkValue2;
							var out_min = 0.1;
							var out_max = 1.0;
							element.links.forEach(function(d, i){
								if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
									d.color=d.colors.seed_word;
									d.connected_to_seed_word = true;
								}
								else {
									d.connected_to_seed_word = true;

									// modify alpha based on value
									//rgba(1, 0, 0, 1)
									var parts = d.colors.normal.split(",");
									if (parts.length != 4) {
										d.color=d.colors.normal;
									}
									else {
										var colTransparent = (d.value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
										parts[3] = colTransparent + ")";
										d.color=parts.join(",");
									}
								}
							});

								// for (var k in nodeWidthHeightMap) {
								// 	if (seedWords.indexOf(k)<0) {
										// nodeWidthHeightMap[k]["width"] = 1.7 + (nodeWidthHeightMap[k]["width"] / nodeWidthHeightMap[k]["width_count"]);
								// 	}
								// }


							  // const Graph = ForceGraph3D()
							  //   (elem)
							  //     .graphData(element)
							  //     .width(1900)
							  //     .height(900)
							  //     .backgroundColor("white")
							  //     .nodeLabel('id')
							  //     // .nodeAutoColorBy('group')
							  //
							  //     .linkWidth(function(d){
							  //         if((d.value-minLinkValue)<0.2)
							  //             return 0;
							  //         else
							  //             return 1;
							  //     })
							  //     .linkOpacity(1)
							  //     .linkVisibility(node => {
							  //       if((node.value-minLinkValue)<0.2)
							  //           return false;
							  //       else
							  //           return true;
							  //     })
							  //     .linkSource("from")
							  //     .linkTarget("to")
							  //     // .enablePointerInteraction(false)
							  //     .linkColor("color")
							  //     .nodeOpacity(1)
							  //     .onNodeHover(node => {
							  //       console.log(node)
							  //       console.log(elem.style.cursor)
							  //
							  //         elem.style.cursor = node ? 'pointer' : null
							  //         console.log(node)
							  //         console.log(elem.style.cursor)
							  //     })
							  //     // .nodeThreeObject(node => {
							  //     //     const sprite = new SpriteText(node.id);
							  //     //     sprite.color = node.color;
							  //     //     sprite.textHeight = 8;
							  //     //     return sprite;
							  //     // })
							  //     .onNodeClick(node => {
							  //       // Aim at node from outside it
							  //       console.log(node)
							  //       console.log(elem.style.cursor)
							  //       const distance = 40;
							  //       const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
							  //
							  //       Graph.cameraPosition(
							  //         { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
							  //         node, // lookAt ({ x, y, z })
							  //         3000  // ms transition duration
							  //       );
							  //     });

								// var elementCopy = JSON.parse(JSON.stringify(element));


								let highlightNodes = [];
								let highlightLink = null;

								const Graph = ForceGraph()
									(elem)
									.width(width)
									.height(height)
									  // .linkDirectionalParticles(2)
									  .nodeId("id")
										.nodeLabel('title')
										.linkLabel(function(d){
											if(selectedNode!=null){
													if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
															if(d.value<(threshholdFilterValue/100)){
																	return false;
															}
															else{
															return d.title;
															}
													}
													else{
														return false;
													}
											}
											else{
													if(d.value<(threshholdFilterValue/100)){
															return false;
													}
													else{
															return d.title;
													}
											}
									  })
										// .nodeRelSize(10)
										// .nodeVal(function(d){
										// 	// console.log(nodeWidthHeightMap[d.id].width)
										// 		return nodeWidthHeightMap[d.id].width*5;
										// })
									  // .linkSource("from")
									  // .linkTarget("to")
										.linkCurvature(0.05)
										.linkDirectionalArrowRelPos(0.4)
										.linkDirectionalArrowLength(function(d){
												if(showArrowIsChecked){
														if(selectedNode!=null){
																if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
																		if(d.value<(threshholdFilterValue/100)){
																				return 0.0001;
																		}
																		else{
																			// return Math.pow((((d.value))-0.75)*4, 2);
																			return 2;
																		}
																}
																else{
																	return 0;
																}
														}
														else{
															  if(d.value<(threshholdFilterValue/100)){
																  	return 0;
															  }
															  else{
																		return 2;
															  }
														}
												}
												else{
													return 0;
												}
									  })
									  .nodeCanvasObject((node, ctx, globalScale) => {
										// console.log(node)
										//   console.log(ctx)
												// if(showLabelIsChecked){
												// 	const label = node.word;
												// 	const fontSize = 12/globalScale;
												// 	ctx.font = `${fontSize}px Sans-Serif`;
												// 	const textWidth = ctx.measureText(label).width;
												// 	const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
												// 	ctx.fillStyle = 'rgba(0, 0, 0, 0.99)';
												// 	ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
												// 	ctx.textAlign = 'center';
												// 	ctx.textBaseline = 'middle';
												// 	ctx.fillStyle = node.color;
												// 	ctx.fillText(label, node.x, node.y);
												// }
												// else{
												ctx.beginPath();
												if(seedWords.indexOf(node.id)>-1)
	                      		ctx.ellipse(node.x, node.y, 10, 10, 0, 0, 2 * Math.PI);
												else {
														ctx.ellipse(node.x, node.y, (Math.pow(((((nodeWidthHeightMap[node.id].width-1)/nodeWidthHeightMap[node.id].seedNeighbours)-minLinkValue)/(maxLinkValue-minLinkValue)), 1)*10), (nodeWidthHeightMap[node.id].neighbours*10/200), 0, 0, 2 * Math.PI);
												}
												if(selectedNode!=null){
														if(adjacentMap[selectedNode.id]){
																if(adjacentMap[selectedNode.id].has(node.id)){
																		ctx.fillStyle = try_get_ddc_color(node);
																		ctx.strokeStyle= node.colors.pos;
																}
																else{
																		if(selectedNode.id==node.id){
																		ctx.fillStyle = try_get_ddc_color(node);
																		ctx.strokeStyle= node.colors.pos;
																		}
																		else{
																			ctx.fillStyle = try_get_ddc_color_muted(node);
																			ctx.strokeStyle= node.colors.muted;
																		}
																}
														}
														else{
															ctx.fillStyle = try_get_ddc_color_muted(node);
															ctx.strokeStyle= node.colors.muted;
														}
												}
												else{
													ctx.fillStyle = try_get_ddc_color(node);
													ctx.strokeStyle= node.colors.pos;
												}
												ctx.lineWidth= 1;
	                      ctx.fill();

	                      if (node.is_seed_word) {
							 ctx.lineWidth= 3;
						 }

	                      ctx.stroke();

												ctx.lineWidth= 1;

												if(showLabelIsChecked){
														const label = node.word;
														var fontSize = 12/globalScale;
														if(globalScale>2){
																ctx.font = `${fontSize}px Sans-Serif`;
																const textWidth = ctx.measureText(label).width;
																const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
																ctx.fillStyle = node.colors.textbg;
																ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

																ctx.fillStyle = node.colors.text;
																ctx.textAlign = 'center';
																ctx.textBaseline = 'middle';
																// ctx.fillStyle = node.color;
																ctx.fillText(label, node.x, node.y);
														}
												}
												// }
									  })
										.onNodeClick(node => {
											// Center/zoom on node
												if(selectedNode){
														if(node.id==selectedNode.id)
																selectedNode = null;
														else {
																selectedNode = node;
																// for(var i=0; i<element.links.length; i++){
																// 		var tmpLink = element.links[i];
																// 		if(tmpLink.to!=node.id && tmpLink.from!=node.id){
																// 				element.links.splice(i, 1);
																// 				i--;
																// 		}
																// }
														}
												}
												else {
														selectedNode = node;
														// for(var i=0; i<element.links.length; i++){
														// 		var tmpLink = element.links[i];
														// 		if(tmpLink.to!=node.id && tmpLink.from!=node.id){
														// 				element.links.splice(i, 1);
														// 				i--;
														// 		}
														// }
												}
												var selectedLinks = [];
												var unselectedLinks = [];
												for(var i in element.links){
														var tmpLink = element.links[i];
														if(selectedNode!=null){
																if(selectedNode.id==tmpLink.source.id || selectedNode.id==tmpLink.target.id){
																		if(tmpLink.value<(threshholdFilterValue/100)){
																			unselectedLinks.push(tmpLink)
																		}
																		else{
																			selectedLinks.push(tmpLink)
																		}
																}
																else{
																	unselectedLinks.push(tmpLink)
																}
														}
														else{
															  if(tmpLink.value<(threshholdFilterValue/100)){
																	unselectedLinks.push(tmpLink)
															  }
															  else{
																	selectedLinks.push(tmpLink)
															  }
														}
												}
												element.links = [];

												for(var i in unselectedLinks){
													element.links.push(unselectedLinks[i])
												}
												for(var i in selectedLinks){
													element.links.push(selectedLinks[i])
												}
										})
									  .graphData(element)
										.zoom(2.2)
										.onLinkHover(link => {
												if(link){
														if(selectedNode!=null){
																if(selectedNode.id==link.source.id || selectedNode.id==link.target.id){
																		if(link.value<(threshholdFilterValue/100)){
																		}
																		else{
																				highlightLink = link;
																				highlightNodes = link ? [link.source, link.target] : [];
																		}
																}
																else{
																}
														}
														else{
																if(link.value<(threshholdFilterValue/100)){
																}
																else{
																		highlightLink = link;
																		highlightNodes = link ? [link.source, link.target] : [];
																}
														}
												}
												else{
														highlightLink = null;
														highlightNodes = [];
												}
												// highlightLink = link;
												// highlightNodes = link ? [link.source, link.target] : [];
										})
										// .linkWidth(link => link === highlightLink ? 5 : 1)
										.linkDirectionalParticles(4)
										.linkDirectionalParticleSpeed(function(d){
												return d.value/50;
										})
										.linkDirectionalParticleWidth(link => link === highlightLink ? 4 : 0)
										.linkHoverPrecision(0.0000015)  
										.linkColor(function(d) {
											if (d.connected_to_seed_word) {
												return d.color;
											}
											if(selectedNode!=null){
														if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
															return d.colors.normal;
													}
												}
											return d.color;
										})
										.linkVisibility(function(d) {
											if(selectedNode!=null){
												if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
													return d.value>=(threshholdFilterValue/100);
												}
											}
											return d.value>=(threshholdFilterValue/100);
										})
									  .linkWidth(function(d){
												if(selectedNode!=null){
														if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
																if(d.value<(threshholdFilterValue/100)){
																		return 0.00000001;
																}
																else{
																		return Math.pow(d.value, 4);
																}
														}
														else{
															return 0.00000001;
														}
												}
												else{
													  if(d.value<(threshholdFilterValue/100)){
														  	return 0.00000001;
													  }
													  else{
															return Math.pow(d.value, 4);
													  }
												}
									  });
						
					});
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					console.log("Error: " + jqXHR.status + ": " + jqXHR.statusText);
				})
				.always(function () {
				});
			};
			
			$('.embeddingviz').each(function(ind) {
				var thisViz = $(this);
				console.log(thisViz);
				var words_input = thisViz.attr("data-words").split(" ");
				var embeddings = thisViz.attr("data-embeddings").split(" ");
				var word_pos = thisViz.attr("data-pos").split(" ");
				var maxn = thisViz.attr("data-maxn");
				if(maxn == null){
					maxn = 25;				
				}
				var width = thisViz.attr("data-width");
				var height = thisViz.attr("data-height");
				var thr = thisViz.attr("data-threshhold-filter");
				if(thr == null){
                                	 thr = 50;
                                }
				thisViz.css("height", height);

var content = '<div style="float:left;">'+
					'<ul style="margin:0; padding:0;width:200px">'+
						'<li style="color:white;margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(31, 119, 180, 1);">000 Computer science</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(255, 127, 14, 0.75)">100 Philosophy</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(44, 160, 44, 0.75)">200 Religion</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(214, 39, 40, 0.75);">300 Social sciences</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(148, 103, 189, 0.75);">400 Language</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(140, 86, 75, 0.75);">500 Science</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(227, 119, 194, 0.75);">600 Technology</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(127, 127, 127, 0.75);">700 Arts</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(188, 189, 34, 0.75);">800 Literature</li>'+
						'<li style="margin-left: 0px; padding: 5px; list-style-type: none; background-color:rgba(23, 190, 207, 0.75);">900 History</li>'+
					'</ul>'+
				'</div>'+
				'<div class="vizdiv" style="position:absolute;clear:both">'+
				'</div>';
				thisViz.html(content);
				
				generate_graph(words_input, embeddings, word_pos, thisViz.find('.vizdiv')[0],width,height, maxn, thr);

			});
		});
});

