export default interface ErrorLike {
    name: string;
    message: string;
    stack?: string;
    cause?: ErrorLike;
}
