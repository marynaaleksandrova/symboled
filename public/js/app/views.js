// symboled
// (c) 2011 Enginimation Studio (http://enginimation.com).
// symboled may be freely distributed under the MIT license.
"use strict";
var ui={};
var global = window;
$(function()
{
    ui.AppView = Backbone.View.extend(
    {
        el: $('body'),
        symbolPanel:$('#symbol_panel'),
        tagsPanel:$('#tags_panel'),
        howPanel:$('#how_panel'),
        aboutPanel:$('#about_panel'),
        emptyPanel:$('#empty_panel'),
        events:
        {
            'click #symbols':'showSymbols',
            'click #tags':'showTags',
            'click #how':'showHow',
            'click #about':'showAbout',
            'dragstart img':'startDragSymbol',
            'click #new_box':'startItemCreation'
        },
        initialize: function()
        {
            this.items=new CareInfoList;
            this.tags=new TagsList;
            this.isSymbolsVisible=false;
            this.isTagsVisible=false;
            this.isHowVisible=false;
            this.isAboutVisible=false;
            _.bindAll(this, 'addOne', 'addAll', 'addOneTag','addAllTags','filter','render');
            this.bind('tag:filter',this.filter);
            this.items.bind('add', this.addOne);
            this.items.bind('refresh', this.addAll);
            this.items.bind('all', this.render);
            this.items.bind('change', this.render);

            this.tags.bind('add',this.addOneTag);
            this.tags.bind('refresh', this.addAllTags);
            this.tags.bind('all', this.render);
            this.tags.bind('change', this.render);

            this.items.fetch();
            this.tags.fetch();
        },
        startItemCreation: function()
        {
            this.isSymbolsVisible=false;
            this.showSymbols();
            this.$('#new_box').focus();
        },
        startDragSymbol:function(e)
        {
            var originalEvent = e.originalEvent;
            var src=this.$(e.currentTarget).attr('src');
            var description = e.currentTarget.dataset.description;
            var id = e.currentTarget.dataset.id;
            originalEvent.dataTransfer.setData('text/html', JSON.stringify(
            {
                src:src,
                description:description,
                alt:description,
                symbolId:id
            }));
        },
        filter:function(tag)
        {
            var tagFilter=tag.trim();
            this.items.fetch();
            var filteredItems = this.items.filter(function(item)
            {
                var itemTags=item.get('tags').split(',');
                return _.include(itemTags,tagFilter);
            });
            this.$('.garment_info').remove();
            this.items.refresh(filteredItems);
        },
        showSymbols:function()
        {
            this.$('#site_header nav li').removeClass('active');
            this.$('#symbols').addClass('active');
            this.$('.menu_panel').hide();
            if(this.isSymbolsVisible)
            {
                this.symbolPanel.hide();
                this.emptyPanel.show();
                this.isSymbolsVisible=false;
            }
            else
            {
                this.symbolPanel.show();
                this.emptyPanel.hide();
                this.isSymbolsVisible=true;
            }
        },
        showTags:function()
        {
            this.$('#site_header nav li').removeClass('active');
            this.$('#tags').addClass('active');
            this.$('.menu_panel').hide();
            if(this.isTagsVisible)
            {
                this.tagsPanel.hide();
                this.emptyPanel.show();
                this.isTagsVisible=false;
            }
            else
            {
                this.tagsPanel.show();
                this.emptyPanel.hide();
                this.isTagsVisible=true;
            }
        },
        showHow:function()
        {
            this.$('#site_header nav li').removeClass('active');
            this.$('#how').addClass('active');
            this.$('.menu_panel').hide();
            if(this.isHowVisible)
            {
                this.howPanel.hide();
                this.emptyPanel.show();
                this.isHowVisible=false;
            }
            else
            {
                this.howPanel.show();
                this.emptyPanel.hide();
                this.isHowVisible=true;
            }
        },
        showAbout:function()
        {
            this.$('#site_header nav li').removeClass('active');
            this.$('#about').addClass('active');
            this.$('.menu_panel').hide();
            if(this.isAboutVisible)
            {
                this.aboutPanel.hide();
                this.emptyPanel.show();
                this.isAboutVisible=false;
            }
            else
            {
                this.aboutPanel.show();
                this.emptyPanel.hide();
                this.isAboutVisible=true;
            }
        },
        addOne: function(item,key)
        {
            var view = new ui.ItemView({model: item});
            if(_.isNumber(key))
            {
                var numberId=key+1;
            }
            else
            {
                var numberId=this.items.length;
            }
            var count=Math.floor(this.items.length/4);
            var remaining=this.items.length%4;
            if(remaining!=0)
            {
                count++;
            }
            console.log(count);
            if(numberId==1)
            {
                var selector='#container .second';
            }
            else if(numberId==2)
            {
                var selector='#container .third';
            }
            else if(numberId==3)
            {
                var selector='#container .forth';
            }
            else if(numberId==4)
            {
                var selector='#container .first';
            }
            else if(numberId%4==1)
            {
                var selector='#container .second';
            }
            else if(numberId%4==2)
            {
                var selector='#container .third';
            }
            else if(numberId%4==3)
            {
                var selector='#container .forth';
            }
            else
            {
                var selector='#container .first';
            }
// /            if(numberId<=count)
//            {
//                var selector='#container .second';
//            }
//            else if(numberId<=count*2)
//            {
//                var selector='#container .third';
//            }
//            else if(numberId<=count*3)
//            {
//                var selector='#container .forth';
//            }
//            else if(numberId<=count*4)
//            {
//                var selector='#container .first';
//            }
//            if(numberId%3==0)
//            {
//                selector='#container .forth';
//            }
//            if(numberId%2==0)
//            {
//                selector='#container .third';
//            }
//            if(numberId%4==0)
//            {
//                selector='#container .first';
//            }
            console.log('NID='+numberId+';selector='+selector);
            this.$(selector).append(view.render().el);
        },

        addAll: function()
        {
            this.items.each(this.addOne);
        },

        addOneTag: function(item)
        {
            if(!_.include(this.tags,item))
            {
                var view = new ui.TagView({model: item});
                this.$('#tags_panel').append(view.render().el);
            }
        },

        addAllTags: function()
        {
            this.tags.each(this.addOneTag);
        }

    });

    ui.NewItemView = Backbone.View.extend(
    {
        el: $('#new_box'),
        garmentName:$('#garment_name'),
        garmentTags:$('#garment_tags'),
        garmentNotes:$('#garment_notes'),
        symbolsPanel:$('#drop_zone'),
        symbolsPanelText:$('#drag_instructions'),
        template: _.template($('#symbol_tpl').html()),
        symbols: [],
        events:
        {
            'click #add':'addNewItem',
            'dragover':'dragOverSymbols',
            'drop':'dropSymbols'
        },
        initialize:function()
        {
            this.isError=false;
        },
        dragOverSymbols: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
        },
        dropSymbols: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            var data=JSON.parse(e.originalEvent.dataTransfer.getData('text/html'));
            this.symbols.push(data);
            var html = this.template(data);
            this.symbolsPanelText.hide();
            this.symbolsPanel.append(html);
        },
        newAttributes: function()
        {
            return {
                name: this.garmentName.val(),
                tags: this.garmentTags.val(),
                notes:  this.garmentNotes.val(),
                symbols: this.symbols
            };
        },
        clear: function()
        {
            this.garmentName.val('');
            this.garmentTags.val('');
            this.garmentNotes.val('');
            this.symbolsPanelText.show();
            this.$('img').remove();
            this.symbols=[];
        },
        addNewItem:function()
        {
            var self = this;
            var attributes = this.newAttributes();
            var tagsArray=attributes.tags.split(',');
            _.each(tagsArray,function(tag)
            {
                if(tag)
                {
                    AppController.appView.tags.create({tag:tag});
                }
            });
            var newItem = new CareInfoItem(attributes);
            newItem.save(attributes,
            {
                error: function(model,error)
                {
                    self.garmentName.attr('placeholder','Name is mandatory');
                    self.garmentName.addClass('error');
                    self.isError=true;
                },
                success: function(model,resp)
                {
                    self.isError=false;
                    AppController.appView.items.add(newItem);
                    self.garmentName.attr('placeholder','Garment name');
                    self.garmentName.removeClass('error');
                    self.clear();
                }
            });
        }
    });

    ui.ItemView = Backbone.View.extend(
    {
        className:'box garment_info',
        tagName:'article',
        template: _.template($('#item_tpl').html()),
        symBolTemplate: _.template($('#symbol_tpl').html()),
        events:
        {
            'click .delete_btn': 'clear',
            'click .edit_btn': 'edit',
            'dragover':'dragOverSymbols',
            'drop':'dropSymbols',
            'click .save':'save'
        },
        initialize: function()
        {
            _.bindAll(this, 'render','close','remove','edit','dragOverSymbols','dropSymbols','save','newAttributes');
            this.symbols=[];
            this.model.bind('change', this.render);
            this.model.view = this;
        },
        dragOverSymbols: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
        },
        dropSymbols: function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            var data=JSON.parse(e.originalEvent.dataTransfer.getData('text/html'));
            this.symbols.push(data);
            var html = this.symBolTemplate(data);
            this.$('.drop_zone').append(html);
        },
        newAttributes: function()
        {
            return {
                name: this.$('.edit_garment_name').val(),
                tags: this.$('.edit_garment_tags').val()||'',
                notes:  this.$('.edit_garment_notes').val()||'',
                symbols: this.symbols
            };
        },
        render: function()
        {
            $(this.el).html(this.template(this.model.toJSON()));
            if(_.isEmpty(this.model.get('notes')))
            {
                this.$('.notes').remove();
            }
            return this;
        },
        edit:function()
        {
            this.$('.edit').show();
            this.$('.display').hide();
        },
        save:function()
        {
            var self=this;
            var attributes=this.newAttributes();
            this.model.save(attributes,
            {
                error: function(model,error)
                {
                    self.$('.edit_garment_name').attr('placeholder','Name is mandatory');
                    self.$('.edit_garment_name').addClass('error');
                    self.isError=true;
                },
                success:function(model,resp)
                {
                    self.$('.edit_garment_name').removeClass('error');
                    self.$('.edit').hide();
                    self.$('.display').show();
                }
            });
        },
        remove: function()
        {
            $(this.el).remove();
        },
        clear: function()
        {
            if(confirm("Do you really want to delete this item?"))
            {
                this.model.destroy();
                this.remove();
            }
        }
    });

    ui.TagView = Backbone.View.extend(
    {
        className:'tag_filter',
        tagName:'p',
        template: _.template($('#tag_tpl').html()),
        events:
        {
            'click': 'selectTag'
        },
        initialize: function()
        {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.model.view = this;
        },
        render: function()
        {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        selectTag:function()
        {
            var tag=$(this.el).html();
            AppController.appView.trigger('tag:filter',tag);
        }

    });
});