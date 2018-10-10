Vue.component('tabs',{
    template:'\
        <div class="tabs">\
            <div class="tabs-bar">\
             <!--标题页的标题 v-for遍历, :class 动态绑定class-->\
                <div \
                    :class="tabCls(item)"\
                    v-for="(item,index) in navList"\
                    @click="handleChange(index)">\
                    {{item.label}}\
                </div>\
            </div>\
            <div class="tabs-content">\
                <!-- 这里的slot是嵌套pane组件 -->\
                <slot></slot>\
            </div>\
        </div>',
    props:{
        value:{
            //接收父组件的value
            type:[String]
        }
    },
    data:function(){
        return {
            //保存父组件的value到currentValue变量中，以便在本地维护
            currentValue:this.value,
            //将pane的标题保存到数组中
            navList:[]
        }
    },
    methods:{
        tabCls:function(item){
            //为当前选中的tab加一个tabs-tab-active class
            return [
                'tabs-tab',
                {
                    'tabs-tab-active':item.name === this.currentValue
                }
            ];
        },
        getTabs:function(){
            //使用$children遍历子组件，得到所有的pane组件
            return this.$children.filter(function(item){
                return item.$options.name === 'pane';
            });
        },
        //更新tabs
        updateNave:function(){
            this.navList = [];
            // foreach里面的回调里的this不再是tabs组件本身，所以设置_this=this
            var _this= this;
            this.getTabs().forEach(function(pane,index){
                _this.navList.push({
                    label:pane.label,
                    name:pane.name || index
                });
                //如果没有设置name，默认设置为索引值
                if(!pane.name) pane.name = index;
                //设置第一个pane为当前显示的tab
                if(index === 0){
                    if(!_this.currentValue){
                        _this.currentValue = pane.name || index;
                    }
                }
            });
            this.updateStatus();     
        },
        updateStatus:function(){
            var tabs = this.getTabs();
            var _this = this;
            //显示当前选中的tab对应的pane组件，隐藏没有选中的
            tabs.forEach(function(tab){
                return tab.show = tab.name ===_this.currentValue;
            });
        },
         //点击tab标题触发
        handleChange:function(index){
            var nav = this.navList[index];
            var name = nav.name;
             //改变当前选中的tab，触发watch
            this.currentValue = name;
            //实现子组件与父组件通信
            this.$emit('input',name);
        }
    },
    watch:{
        // 监听value变化
        value:function(val){
            this.currentValue = val;
        },
        // 监听currentValue变化，更新对应的pane组件
        currentValue:function(){
            this.updateStatus();
        }
    }
})