const {expect} = require('chai');
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mockRaf = require('mock-raf')();
const sinon = require('sinon');

describe('ResizeObserver', () => {
	let rafStub;

    beforeEach(() => {
        global.window = MockBrowser.createWindow();
        global.document = MockBrowser.createDocument();

        window.requestAnimationFrame = mockRaf.raf;
        rafStub = sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);
        require('../resize-observer');
    });

    afterEach(() => {
        delete require.cache[require.resolve('../resize-observer')];
    });

    it('is attached to window', () => {
        expect(window.ResizeObserver).not.to.be.undefined;
    });

    it('begins waiting', () => {
        expect(window.requestAnimationFrame.calledOnce).to.equal(true);
    });

    describe('constructor', () => {
        it('creates a new ResizeObserver', () => {
            const ro = new window.ResizeObserver();
            expect(ro).to.be.an.instanceof(window.ResizeObserver);
        });

        it('adds the new ResizeObserver to document.resizeObservers', () => {
            const ro = new window.ResizeObserver();
            expect(document.resizeObservers.length).to.equal(1);
        });
    });

    describe('observe', () => {
        it('watches the element for height changes', () => {
            const element = document.createElement('div');
            element.style.height = '0px';
            document.body.appendChild(element);
            const callback = sinon.spy();
            const ro = new window.ResizeObserver(callback);

            ro.observe(element);

            expect(callback.called).to.equal(false);

            element.style.height = '10px';
            mockRaf.step();

            expect(callback.called).to.equal(true);
        });
    });
});