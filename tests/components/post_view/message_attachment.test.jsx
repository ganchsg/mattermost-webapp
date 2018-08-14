// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import MessageAttachment from 'components/post_view/message_attachments/message_attachment.jsx';
import {doPostAction} from 'actions/post_actions.jsx';
import {postListScrollChange} from 'actions/global_actions';

jest.mock('actions/post_actions.jsx', () => ({
    doPostAction: jest.fn(),
}));

jest.mock('actions/global_actions.jsx', () => ({
    postListScrollChange: jest.fn(),
}));

describe('components/post_view/MessageAttachment', () => {
    const attachment = {
        pretext: 'pretext',
        author_name: 'author_name',
        author_icon: 'author_icon',
        author_link: 'author_link',
        title: 'title',
        title_link: 'title_link',
        text: 'short text',
        image_url: 'image_url',
        thumb_url: 'thumb_url',
        color: '#FFF',
    };

    const baseProps = {
        postId: 'post_id',
        attachment,
    };

    test('should match snapshot', () => {
        const wrapper = shallow(<MessageAttachment {...baseProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match state and have called postListScrollChange on handleImageHeightReceived', () => {
        const wrapper = shallow(<MessageAttachment {...baseProps}/>);
        const instance = wrapper.instance();
        instance.checkAttachmentTextOverflow = jest.fn();

        wrapper.setState({checkOverflow: false});
        instance.handleImageHeightReceived();
        expect(postListScrollChange).toHaveBeenCalledTimes(1);
        expect(wrapper.state('checkOverflow')).toEqual(true);
    });

    test('should match value on getActionView', () => {
        let wrapper = shallow(<MessageAttachment {...baseProps}/>);
        expect(wrapper.instance().getActionView()).toMatchSnapshot();

        const newAttachment = {
            ...attachment,
            actions: [
                {id: 'action_id_1', name: 'action_name_1'},
                {id: 'action_id_2', name: 'action_name_2'},
                {id: 'action_id_3', name: 'action_name_3', type: 'select', data_source: 'users'},
            ],
        };

        const props = {...baseProps, attachment: newAttachment};

        wrapper = shallow(<MessageAttachment {...props}/>);
        expect(wrapper.instance().getActionView()).toMatchSnapshot();
    });

    test('should call PostActions.doPostAction on handleAction', () => {
        const actionId = 'action_id_1';
        const newAttachment = {
            ...attachment,
            actions: [{id: actionId, name: 'action_name_1'}],
        };
        const props = {...baseProps, attachment: newAttachment};
        const wrapper = shallow(<MessageAttachment {...props}/>);
        expect(wrapper).toMatchSnapshot();
        wrapper.instance().handleAction({
            preventDefault: () => {}, // eslint-disable-line no-empty-function
            currentTarget: {getAttribute: () => {
                return 'action_id_1';
            }},
        });

        expect(doPostAction).toBeCalledWith(props.postId, actionId);
    });

    test('should match value on getFieldsTable', () => {
        let wrapper = shallow(<MessageAttachment {...baseProps}/>);
        expect(wrapper.instance().getFieldsTable()).toMatchSnapshot();

        const newAttachment = {
            ...attachment,
            fields: [
                {title: 'title_1', value: 'value_1', short: 'short_1'},
                {title: 'title_2', value: 'value_2', short: 'short_2'},
            ],
        };

        const props = {...baseProps, attachment: newAttachment};

        wrapper = shallow(<MessageAttachment {...props}/>);
        expect(wrapper.instance().getFieldsTable()).toMatchSnapshot();
    });
});