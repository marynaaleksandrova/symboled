// symboled
// (c) 2011 Enginimation Studio (http://enginimation.com).
// symboled may be freely distributed under the MIT license.
"use strict";
var store=new Store('care_information');
var CareInfoItem = Backbone.Model.extend(
{
    localStorage: store,
    validate: function(attrs)
    {
        if (_.isEmpty(attrs.name))
        {
            return 'Garment name is mandatory';
        }
      }
});
var CareInfoList = Backbone.Collection.extend(
{
    model: CareInfoItem,
    localStorage: store
});
var Tag = Backbone.Model.extend(
{
    initialize:function()
    {
        this.id=this.attributes.tag;
    }
});
var TagsList = Backbone.Collection.extend(
{
    model: Tag,
    localStorage: new Store('tags')
});
