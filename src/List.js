import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'

class List extends Component {
  state = {
    query: ''
  }

  openList = () => {
    document.querySelector('.list').style.width = '220px'
    this.changeTabIndex(0, '.locations-input')
  }

  closeList = () => {
    document.querySelector('.list').style.width = '0'
    this.changeTabIndex(-1, '.open-button')
  }

  // When opening/closing the list, change the value of tabIndex
  // and which element to focus after opening/closing
  changeTabIndex(val, el) {
    document.querySelector('.locations-input').setAttribute('tabIndex', val)
    document.querySelectorAll('li').forEach((list) => {
      list.setAttribute('tabIndex', val)
    })
    document.querySelector('.close-button').setAttribute('tabIndex', val)
    document.querySelector(el).focus()
  }

  // Check if the button pressed was Spacebar or Enter
  // then check class name of the button and fire proper function
  handleKeyPress = (event, listing) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      if (event.target.className === 'open-button') {
        this.openList()
      } else if (event.target.className === 'close-button') {
        this.closeList()
      } else {
        this.openInfo(listing)
      }
    }
  }

  updateQuery = (query) => {
    this.setState({query: query.trim()})
  }

  clearQuery = () => {
    this.setState({query: ''})
  }

  // Compare listing's name with marker's title and if it matches
  // open InfoWindow for that specific marker by triggering the event assigned to it
  openInfo = (listing) => {
    this.props.markers.map(marker => {
      if (listing.name === marker.title) {
        window.google.maps.event.trigger(marker, 'click')
        }
    })
  }

  render() {
    const {locations, markers} = this.props
    const {query} = this.state

    let showingLocations

    // As user types into text input display matching:
    // - listings by comparing them to names of locations
    // - markers by comparing them to titles of markers and changing their visibility
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocations = locations.filter((location) => match.test(location.name))
      markers.map(marker => {
        if (match.test(marker.title)) {
          marker.setVisible(true)
        } else {
          marker.setVisible(false)
        }
      })
    } else {
      showingLocations = locations
      markers.map(marker => {
        marker.setVisible(true)
      })
    }

    return(
      <div>
        <span className={'open-button'} onClick={this.openList} onKeyDown={this.handleKeyPress} tabIndex='0' role='button' aria-label='Open list'>☰</span>
        <div className={'list'}>
          <input
            className={'locations-input'}
            type='text'
            placeholder='Filter locations'
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
            tabIndex='-1'
            role='search'
            aria-label='Filter locations'
            />

          {showingLocations.length === 0 && (
            <div className='no-results'>
              <p>No results found</p>
              <button onClick={this.clearQuery}>Clear filter</button>
            </div>
          )}

          <ul>
            {showingLocations.map((marker) => (
              <li key={marker.name} onClick={() => this.openInfo(marker)} onKeyDown={(event) => this.handleKeyPress(event, marker)} role='button' tabIndex='-1'>
                {marker.name}
              </li>
            ))}
          </ul>
          <span className={'close-button'} onClick={this.closeList} onKeyDown={this.handleKeyPress} tabIndex='-1' aria-label='Close list'>◄</span>
        </div>
      </div>
    )
  }
}

export default List
