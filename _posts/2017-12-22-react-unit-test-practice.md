---
title: React 组件单元测试
date: 2017-12-22
category: tech
---

以 React 为例简述一下 UI 测试在项目中的应用，测试框架为 [Jest](https://github.com/facebook/jest) ，渲染 [Enzyme](https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md) 库和测试 API [**enzyme-matchers**](https://github.com/blainekasten/enzyme-matchers)，Jest 语法与 Mocha 比较相似，熟悉后者语法的同学能够快速上手，Enzyme 是来自 airbnb 的开源库，它主要功能是在单元测试执行环境（也就是 node 环境）渲染组件，不仅可以生成快照，也能够执行组件生命周期函数，同时提供提 Dom API 查找节点。

### Jest


```javascript
// 定义测试组
describe('Component test suite', function() {
  // 测试单元
  it('should render correctly', () => {
    expect(...).toBe(...)
  })

  it('should delete correctly', () => {
    expect(...).toBe(...)
  })
})

```


[Expect API ](http://facebook.github.io/jest/docs/en/expect.html#content) 与 [Mock Functions](http://facebook.github.io/jest/docs/en/mock-function-api.html#content) API

### enzyme-matchers


enzyme-matcher 可以看做是对 Jest 与 enzyme api 的一层封装，简化调用。


```javascript
toBeChecked()
toBeDisabled()
toBeEmpty()
toBePresent()
...
toHaveText()
toIncludeText()
toHaveValue()
toMatchElement()
toMatchSelector()

```

### enzyme

- shallow - 快速渲染组件，但不渲染其子组件，速度快但无法测试子组件，简单测试。
- mount - 速度慢，但是渲染子组件，并执行生命周期函数，适合完成复杂测试。
- render - 依赖 cherryIO 库完生成 HTML 结果，适合快照渲染。

enzyme 提供了 ReactWrapper API ，在调用渲染 API 后会得到一个 React 包装对象，可以通过包装对象提供的 API 获取要测试的节点状态。


```JavaScript

wrapper.find(selector) => ReactWrapper

wrapper.contains(nodeOrNodes) => Boolean

wrapper.children() => ReactWrapper

wrapper.first() => ReactWrapper

wrapper.last() => ReactWrapper

...


```


### 渲染测试

使用 enzyme render 函数生成组件快照，每次运行测试会对比原有快照和新生成的是否相同。


```javascript

/**
 * @param {node} component - ReactWrapper
 * @param {object} options - 渲染配置
 * @param {string} options.name - 组件名称
 * @param {boolean} options.skip - 是否跳过
 */
export function snapShotTest(component, options = {}) {
  let testMethod = options.skip === true ? test.skip : test
  testMethod(`renders ${options.name} correctly`, () => {
    const wrapper = render(component)
    expect(renderToJson(wrapper)).toMatchSnapshot()
    // MockDate.reset()
  })
}

```


#### 链式调用


大部分查询节点都会返回 Wrapper 对象，API 可以进行链式调用。


```JavaScript


it('should render phone value correctly ', () => {
  expect(wrapper.find('input').at(0)).toHaveValue('18500000001')
})


```

#### 数据模拟接口


可以通过 `setState` 和 `setProps` 接口模拟组件内外部状态变化，从而达到测试组件状态动态改变时响应的 UI 是否做出了正确改变。


```JavaScript


// 受控组件值变化验证，来自父组件 props value 值的变化
it('should onChange  called ', () => {
  expect(wrapper.find('.picker-input-text').text()).toBe('2')
  wrapper.setProps({ value: 1 })
  expect(wrapper.find('.picker-input-text').text()).toBe('1')
})

// 改变 popupView 组件弹框显示或隐藏的内部状态
it('should click correctly', () => {
  wrapper.setState({ show: false })
  expect(wrapper.find('.am-notice-bar-marquee-wrap')).toBeEmpty()
})


```


#### 事件模拟接口 `simulate`



```JavaScript

const onChange = jest.fn()
const mockEvent = {
  key: 'Click',
}

// 模拟点击事件
it('should delete correctly', () => {
  const item = wrapper.find('.am-image-picker-item-remove').at(0) // 定位 react 元素
  item.simulate('click', mockEvent) // 模拟 click 方法
  expect(onChange).toBeCalled() // 检验 onChange 函数调用
})

```


`2017-12-22`
