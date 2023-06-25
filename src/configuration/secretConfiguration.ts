import dotenv from 'dotenv';

dotenv.config({path:'.env'});

interface ISecret{
    getSecret(): string;
}

class SecretConfiguration{
    public static MS_SECRET = process.env.MS_SECRET || 'secret';
    public static US_SECRET = process.env.US_SECRET || 'secret';
    public static PY_SECRET = process.env.PY_SECRET || 'secret';
}

class MSSecret implements ISecret{
    public getSecret(): string{
        return SecretConfiguration.MS_SECRET;
    }
}

class USSecret implements ISecret{
    public getSecret(): string{
        return SecretConfiguration.US_SECRET;
    }
}

class PYSecret implements ISecret{
    public getSecret(): string{
        return SecretConfiguration.PY_SECRET;
    }
}

export {ISecret, MSSecret, USSecret, PYSecret};