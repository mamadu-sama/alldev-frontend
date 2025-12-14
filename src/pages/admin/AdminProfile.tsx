import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  User,
  Mail,
  Shield,
  ArrowLeft,
  Save,
  Upload,
  X,
  Calendar,
  Activity,
  Award,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/user.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const adminProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(30, 'Username deve ter no máximo 30 caracteres')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username pode conter apenas letras, números e underscore'
    )
    .optional(),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres').optional(),
  skills: z.string().optional(),
  github: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  twitter: z.string().url('URL inválida').optional().or(z.literal('')),
  portfolio: z.string().url('URL inválida').optional().or(z.literal('')),
});

type AdminProfileFormData = z.infer<typeof adminProfileSchema>;

export default function AdminProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      username: '',
      bio: '',
      skills: '',
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
    },
  });

  // Load current user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setIsLoadingProfile(true);
        const profile = await userService.getProfile();

        setValue('username', profile.username || '');
        setValue('bio', profile.bio || '');
        setValue('skills', profile.skills?.join(', ') || '');
        setValue('github', profile.socialLinks?.github || '');
        setValue('linkedin', profile.socialLinks?.linkedin || '');
        setValue('twitter', profile.socialLinks?.twitter || '');
        setValue('portfolio', profile.socialLinks?.portfolio || '');

        // Update auth store
        updateUser(profile);
      } catch (error) {
        toast.error('Erro ao carregar perfil');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, setValue, updateUser]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: AdminProfileFormData) => {
    try {
      setIsLoading(true);

      // Prepare form data
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.bio) formData.append('bio', data.bio);
      if (data.skills) {
        const skillsArray = data.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        formData.append('skills', JSON.stringify(skillsArray));
      }
      
      // Social links
      const socialLinks: any = {};
      if (data.github) socialLinks.github = data.github;
      if (data.linkedin) socialLinks.linkedin = data.linkedin;
      if (data.twitter) socialLinks.twitter = data.twitter;
      if (data.portfolio) socialLinks.portfolio = data.portfolio;
      
      if (Object.keys(socialLinks).length > 0) {
        formData.append('socialLinks', JSON.stringify(socialLinks));
      }
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updatedProfile = await userService.updateProfile(formData);
      updateUser(updatedProfile);

      toast.success('Perfil atualizado com sucesso!');
      handleRemoveAvatar();
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || 'Erro ao atualizar perfil'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Meu Perfil de Admin
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src={
                    avatarPreview ||
                    user?.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                  }
                />
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Alterar
                </Button>
                {avatarPreview && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                JPG, PNG ou WebP. Max 2MB.
              </p>
            </div>

            {/* User Stats */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  ADMIN
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Reputação:
                </span>
                <span className="text-sm font-medium">{user?.reputation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nível:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {user?.level || 'NOVATO'}
                </Badge>
              </div>
              {user?.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membro desde:</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(user.createdAt), 'MMM yyyy', {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground">Biografia</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {user?.skills && user.skills.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground">Habilidades</h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {user?.socialLinks && Object.keys(user.socialLinks).length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground">Links Sociais</h3>
                <div className="space-y-2">
                  {user.socialLinks.github && (
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="flex-1 truncate">GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="flex-1 truncate">LinkedIn</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="flex-1 truncate">Twitter</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {user.socialLinks.portfolio && (
                    <a
                      href={user.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="flex-1 truncate">Portfolio</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="seu_username"
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades</Label>
                <Input
                  id="skills"
                  {...register('skills')}
                  placeholder="JavaScript, TypeScript, React (separadas por vírgula)"
                />
                {errors.skills && (
                  <p className="text-sm text-destructive">
                    {errors.skills.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Separe as habilidades por vírgula
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-foreground">Links Sociais</h3>
                
                {/* GitHub */}
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    {...register('github')}
                    placeholder="https://github.com/username"
                  />
                  {errors.github && (
                    <p className="text-sm text-destructive">{errors.github.message}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    {...register('linkedin')}
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                  )}
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    {...register('twitter')}
                    placeholder="https://twitter.com/username"
                  />
                  {errors.twitter && (
                    <p className="text-sm text-destructive">{errors.twitter.message}</p>
                  )}
                </div>

                {/* Portfolio */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Portfolio
                  </Label>
                  <Input
                    id="portfolio"
                    {...register('portfolio')}
                    placeholder="https://seu-portfolio.com"
                  />
                  {errors.portfolio && (
                    <p className="text-sm text-destructive">{errors.portfolio.message}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || (!isDirty && !avatarFile)}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

