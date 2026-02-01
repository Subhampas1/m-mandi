import Card from '../common/Card';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-mandi-cream to-saffron-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                {children}
            </Card>
        </div>
    );
};

export default AuthLayout;
