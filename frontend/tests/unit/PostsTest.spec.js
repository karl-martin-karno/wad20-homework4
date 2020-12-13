import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    test('renders exact number', async () => {
        expect(wrapper.findAll('.post').length).toBe(testData.length)
    })

    test('posts with media conain rendered media', () => {
        let postAr = wrapper.findAll('.post')
        for (let i = 0; i < postAr.length; i++) {
            if (testData[i].media == null) {
                expect(postAr.at(i).find('.post-image').exists()).toBeFalsy()
            } else if (testData[i].media.type == "image") {
                expect(postAr.at(i).find('.post-image').exists()).toBeTruthy()
                expect(postAr.at(i).find('.post-image').find('img').exists()).toBeTruthy()
                expect(postAr.at(i).find('video').exists()).toBeFalsy()
            } else if (testData[i].media.type == "video") {
                expect(postAr.at(i).find('.post-image').exists()).toBeTruthy()
                expect(postAr.at(i).find('.post-image').find('img').exists()).toBeFalsy()
                expect(postAr.at(i).find('video').exists()).toBeTruthy()
            }
        }
    })

    test('post time is displayed correctly', () => {
        let postAr = wrapper.findAll('.post')
        for (let i = 0; i < postAr.length; i++) {
            let time = postAr.at(i).find('.post-author').findAll('small').at(1).text()
            expect(time).toBe("Saturday, December 5, 2020 1:53 PM")
        }
    })
});
