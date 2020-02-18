import React, { Component } from 'react'
import { connect } from 'react-redux'
import { incrementAsync, decrementAsync } from './testActions'
import { Button } from 'semantic-ui-react'
import TestInputPlaces from './TestInputPlaces'
import SimpleMap from './SimpleMap'
import { openModal } from '../modals/modalActions'
const mapState = (state) => ({
    data: state.test.data,
    loading: state.async.loading,
    elementName : state.async.elementName
})

const mapDispatch = {
    incrementAsync,
    decrementAsync,
    openModal
}

class TestComponent extends Component {
    render() {
        const { data, incrementAsync, decrementAsync, openModal, loading, elementName } = this.props
        return (
            <div>
                TestComponent
                The answer is {data}
                <Button
                    name="increment"
                    loading={ elementName === "increment" && loading}
                    positive
                    onClick={(e)=>incrementAsync(e.target.name)}
                    content="Increment" />
                <Button
                    name="decrement"
                    loading={elementName === "decrement" && loading }
                    negative
                    onClick={(e)=>decrementAsync(e.target.name)}
                    content="decrement" />
                <Button
                    color="teal"
                    onClick={() => openModal('TestModal', { data: 42 })}
                    content="Open Modal" />
                <br />
                <br />
                <TestInputPlaces />
                <SimpleMap />

            </div>
        )
    }
}

export default connect(mapState, mapDispatch)(TestComponent)