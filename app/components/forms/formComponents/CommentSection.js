import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import { red500 } from 'material-ui/styles/colors';
import FormsyText from './FormsyText';
import formatDate from '../../../../utils/formatDate';

class CommentSection extends Component {
	constructor(props) {
		super(props)

		this.saveComment = this.saveComment.bind(this);
		this.renderCommentSection = this.renderCommentSection.bind(this);
		this.renderComments = this.renderComments.bind(this);
	}

	saveComment() {
		let comment = (this.refs.comment ? this.refs.comment.getValue() : '');
		this.props.handleComment(comment);
		this.refs.comment.state.value = '';
	}

	renderCommentSection() {
		if(this.props.enable) {
			let { centerStyle } = this.props.styles;
			return (
				<div>
					<Divider />
					<Subheader>Comments</Subheader>
					<div style={centerStyle}>
						{this.props.comments.map(this.renderComments)}
						<FormsyText
							ref='comment'
							name='comment'
							fullWidth={true}
							hintText='Enter message for comment'
							floatingLabelText='Comment'
							multiLine={true}
							defaultValue=''
						/>
						<FlatButton
							label='Add Comment'
							onClick={this.saveComment.bind(this)}
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
						/>
					</div>
				</div>
			)
		}
	}

	renderComments(comment, i) {
		let { listStyle, listPaperStyle } = this.props.styles;
		let actions = [];
		if(comment.user == this.props.userId) {
			actions.push(
				<FlatButton
					key={'remove'}
					label='Remove'
					hoverColor={red500}
					style={{marginBottom: '0.5em'}}
					onClick={this.props.handleComment.bind(this, {remove: comment._id})}
				/>
			)
		}
		return (
			<Paper style={listPaperStyle} key={comment._id}>
				<Subheader>{'Comment '+(i+1)}</Subheader>
				<div style={listStyle}>
					<FormsyText
						name={'comments['+i+'][date]'}
						floatingLabelText='Date'
						style={{paddingLeft: '0em'}}
						value={formatDate(new Date(comment.date))}
						fullWidth={true}
						disabled={true}
					/>
					<br />
					<FormsyText
						name={'comments['+i+'][name]'}
						floatingLabelText='Name'
						style={{paddingLeft: '0em'}}
						value={comment.name}
						fullWidth={true}
						disabled={true}
					/>
					<br />
					<FormsyText
						name={'comments['+i+'][message]'}
						floatingLabelText='Message'
						style={{paddingLeft: '0em'}}
						value={comment.comment}
						fullWidth={true}
						multiLine={true}
						disabled={true}
					/>
					<br />
					<center>
						{actions}
					</center>
				</div>
			</Paper>
		)
	}

	render() {
		let { centerStyle } = this.props.styles;
		return (
			<div>
				{this.renderCommentSection()}
			</div>
		);
	}
}

export default CommentSection;